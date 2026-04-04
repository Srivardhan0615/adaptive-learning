import { ArrowLeft, Brain, CheckCircle2, Sparkles, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuestionCard from '../components/test/QuestionCard';
import TestProgressBar from '../components/test/ProgressBar';
import Timer from '../components/test/Timer';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import {
  analyzeConceptPerformance,
  buildConceptMasteryRecords,
  categorizeConcepts,
  generateAdaptiveLessonVariant,
} from '../lib/adaptiveContent';
import { AdaptiveEngine } from '../lib/adaptiveAlgorithm';
import { getCompletedSessions, getLessons, getQuestions, saveCompletedSession, saveConceptMastery, saveLessonVariant } from '../lib/supabase';
import { percent } from '../lib/utils';
import type { AnswerRecord, Question, TestSession } from '../types';

const MIN_TOTAL_QUESTIONS = 10;
const MAX_TOTAL_QUESTIONS = 10;

function chooseNextQuestion(questions: Question[], usedIds: string[], difficulty: number) {
  const exact = questions.find((question) => question.difficulty === difficulty && !usedIds.includes(question.id));
  if (exact) {
    return exact;
  }
  const nearby = questions.find(
    (question) => Math.abs(question.difficulty - difficulty) <= 1 && !usedIds.includes(question.id),
  );
  return nearby ?? questions.find((question) => !usedIds.includes(question.id)) ?? null;
}

function seededShuffle<T>(items: T[], seed: string) {
  const copy = [...items];
  let state = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 1;

  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const swapIndex = state % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function normalizeQuestionText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function uniqueQuestions(questions: Question[]) {
  const seen = new Set<string>();
  return questions.filter((question) => {
    const key = normalizeQuestionText(question.question_text);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getQuestionPriority(question: Question) {
  const examPriority = question.exam_name === 'JEE Advanced' ? 3 : question.exam_name === 'JEE Main' ? 2 : 0;
  const pyqPriority = question.source === 'pyq' ? 2 : 0;
  const difficultyPriority = question.difficulty >= 4 ? 2 : question.difficulty >= 3 ? 1 : 0;
  return examPriority * 100 + pyqPriority * 10 + difficultyPriority;
}

function buildQuestionPaper(questions: Question[], completedSessions: TestSession[], topicId: string, sessionId: string) {
  const topicSessions = completedSessions
    .filter((session) => session.topic_id === topicId)
    .sort((left, right) => {
      const leftTime = left.completed_at ? new Date(left.completed_at).getTime() : 0;
      const rightTime = right.completed_at ? new Date(right.completed_at).getTime() : 0;
      return rightTime - leftTime;
    });

  const sortedQuestions = uniqueQuestions(
    [...questions].sort((left, right) => {
      const priorityDelta = getQuestionPriority(right) - getQuestionPriority(left);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      const difficultyDelta = right.difficulty - left.difficulty;
      if (difficultyDelta !== 0) {
        return difficultyDelta;
      }

      return (right.exam_year ?? 0) - (left.exam_year ?? 0) || left.id.localeCompare(right.id);
    }),
  );

  const usedQuestionIds = new Set(topicSessions.flatMap((session) => session.answers.map((answer) => answer.question_id)));
  let pool = sortedQuestions.filter((question) => !usedQuestionIds.has(question.id));

  if (pool.length < MIN_TOTAL_QUESTIONS) {
    const lastSessionIds = new Set(topicSessions[0]?.answers.map((answer) => answer.question_id) ?? []);
    pool = sortedQuestions.filter((question) => !lastSessionIds.has(question.id));
  }

  if (pool.length < MIN_TOTAL_QUESTIONS) {
    pool = sortedQuestions;
  }

  const shuffledPool = seededShuffle(pool, `${topicId}-${sessionId}-${topicSessions.length}`);
  return shuffledPool.slice(0, Math.min(MAX_TOTAL_QUESTIONS, shuffledPool.length));
}

export default function TestPage() {
  const { sessionId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const engineRef = useRef(new AdaptiveEngine());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sequence, setSequence] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [difficultyToast, setDifficultyToast] = useState<string | null>(null);
  const [latestOutcome, setLatestOutcome] = useState<{
    changed: boolean;
    currentDifficulty: number;
    previousDifficulty: number;
    isCorrect: boolean;
  } | null>(null);
  const subjectId = (location.state?.subjectId as string | undefined) ?? 'subject-mathematics';
  const chapterId = (location.state?.chapterId as string | undefined) ?? 'chapter-math-algebra';
  const topicId = (location.state?.topicId as string | undefined) ?? 'topic-linear-equations';
  const userId = (location.state?.userId as string | undefined) ?? 'demo-user';
  const totalQuestions = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }
    return Math.min(MAX_TOTAL_QUESTIONS, questions.length);
  }, [questions]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (answers.length > 0 && answers.length < totalQuestions) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers.length, totalQuestions]);

  useEffect(() => {
    let isMounted = true;

    async function loadPaper() {
      const [questionData, completedSessions] = await Promise.all([getQuestions(topicId), getCompletedSessions()]);
      const paper = buildQuestionPaper(questionData, completedSessions, topicId, sessionId);

      if (!isMounted) {
        return;
      }

      setQuestions(paper);
      const firstQuestion = chooseNextQuestion(paper, [], 3);
      setSequence(firstQuestion ? [firstQuestion] : []);
      setLoading(false);
      setQuestionStartedAt(Date.now());
    }

    void loadPaper();

    return () => {
      isMounted = false;
    };
  }, [sessionId, topicId]);

  const currentQuestion = sequence[answers.length];
  const currentScore = useMemo(
    () => percent(answers.filter((answer) => answer.correct).length, Math.max(answers.length, 1)),
    [answers],
  );

  function goToNextQuestion(updatedAnswers: AnswerRecord[], nextDifficulty: number) {
    if (updatedAnswers.length >= totalQuestions) {
      void finishSession(updatedAnswers);
      return;
    }

    const usedIds = sequence.map((question) => question.id);
    const nextQuestion = chooseNextQuestion(questions, usedIds, nextDifficulty);
    if (!nextQuestion) {
      void finishSession(updatedAnswers);
      return;
    }
    setSequence((items) => [...items, nextQuestion]);
    setSelected(null);
    setShowResult(false);
    setQuestionStartedAt(Date.now());
  }

  async function finishSession(completedAnswers: AnswerRecord[]) {
    const conceptBreakdown = analyzeConceptPerformance(completedAnswers);
    const { strongConcepts, weakConcepts } = categorizeConcepts(conceptBreakdown);

    const result: TestSession = {
      id: sessionId,
      user_id: userId,
      subject_id: subjectId,
      chapter_id: chapterId,
      topic_id: topicId,
      started_at: new Date(Date.now() - completedAnswers.length * 30000).toISOString(),
      completed_at: new Date().toISOString(),
      answers: completedAnswers,
      final_score: percent(
        completedAnswers.filter((answer) => answer.correct).length,
        completedAnswers.length,
      ),
      ability_estimate: Math.round(engineRef.current.abilityScore),
      weak_concepts: weakConcepts,
      strong_concepts: strongConcepts,
      concept_breakdown: conceptBreakdown,
      status: 'completed',
    };

    const lessons = await getLessons(topicId);
    const lesson = lessons[0];
    if (lesson) {
      const variant = generateAdaptiveLessonVariant(lesson, weakConcepts, strongConcepts);
      await saveLessonVariant({ ...variant, user_id: result.user_id });
    }

    await saveConceptMastery(buildConceptMasteryRecords(userId, conceptBreakdown));
    await saveCompletedSession(result);
    navigate(`/feedback/${sessionId}`, { state: { session: result } });
  }

  function submitCurrentAnswer(forcedSelection?: number) {
    if (!currentQuestion) {
      return;
    }

    const finalSelection = forcedSelection ?? selected;
    if (finalSelection === null) {
      return;
    }

    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
    const outcome = engineRef.current.processAnswer(currentQuestion, finalSelection, timeTaken);
    const nextAnswer: AnswerRecord = {
      question_id: currentQuestion.id,
      selected_option: finalSelection,
      correct: outcome.isCorrect,
      time_taken: timeTaken,
      concept_tag: currentQuestion.concept_tag,
      difficulty: currentQuestion.difficulty,
    };

    const updatedAnswers = [...answers, nextAnswer];
    setAnswers(updatedAnswers);
    setSelected(finalSelection);
    setShowResult(true);
    setLatestOutcome({
      changed: outcome.difficultyChanged,
      currentDifficulty: outcome.newDifficulty,
      previousDifficulty: outcome.previousDifficulty,
      isCorrect: outcome.isCorrect,
    });

    if (outcome.difficultyChanged) {
      setDifficultyToast(
        outcome.newDifficulty > outcome.previousDifficulty
          ? 'Level up: next question gets harder.'
          : 'Adjusting down: next question gets more supportive.',
      );
    } else {
      setDifficultyToast(null);
    }

    window.setTimeout(() => goToNextQuestion(updatedAnswers, outcome.newDifficulty), 1500);
    window.setTimeout(() => setDifficultyToast(null), 1800);
  }

  function handleLeave() {
    if (window.confirm('Leave test? Progress will be lost')) {
      navigate(-1);
    }
  }

  if (loading || !currentQuestion) {
    return <Skeleton className="h-[420px] rounded-3xl" />;
  }

  return (
    <div className="space-y-6">
      {difficultyToast && (
        <div className="fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-full border border-[#cdebd3] bg-white/95 px-5 py-3 text-sm font-semibold text-[#18a9d8] shadow-[0_20px_40px_rgba(58,120,65,0.18)] backdrop-blur-xl">
          {difficultyToast}
        </div>
      )}

      <Card className="sticky top-24 z-20 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" onClick={handleLeave}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Test
            </Button>
            <Badge variant="cyan">Question {answers.length + 1} of {totalQuestions}</Badge>
            <Badge variant="indigo">Score {currentScore}%</Badge>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.2em] text-[#748476]">Ability</div>
              <div className="text-2xl font-bold text-[#172519]">{Math.round(engineRef.current.abilityScore)}</div>
            </div>
            <Timer
              duration={30}
              resetKey={currentQuestion.id}
              onComplete={() => {
                if (!showResult) {
                  submitCurrentAnswer(selected ?? -1);
                }
              }}
            />
          </div>
        </div>

        <TestProgressBar current={answers.length} total={totalQuestions} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <QuestionCard
          question={currentQuestion}
          index={answers.length}
          total={totalQuestions}
          selected={selected}
          showResult={showResult}
          onSelect={setSelected}
          onSubmit={() => submitCurrentAnswer()}
          isCorrect={selected === currentQuestion.correct_answer}
        />

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#edf2ff] p-3">
                <Brain className="h-5 w-5 text-[#8198ff]" />
              </div>
              <div>
                <div className="text-sm text-[#748476]">Adaptive engine</div>
                <div className="text-lg font-semibold text-[#172519]">Difficulty {engineRef.current.currentDifficulty}</div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-4">
              <div className="text-sm text-[#748476]">Live ability estimate</div>
              <div className="mt-2 text-4xl font-bold text-[#29c1ef]">{Math.round(engineRef.current.abilityScore)}</div>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-7 text-[#536255]">
              <div>Two consecutive correct answers raise difficulty.</div>
              <div>Two consecutive wrong answers lower difficulty.</div>
              <div>Fast correct answers add a small ability bonus.</div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#29c1ef]" />
              <h3 className="text-lg font-semibold text-[#172519]">Latest adjustment</h3>
            </div>
            {latestOutcome ? (
              <div
                className={`rounded-[24px] border p-4 ${
                  latestOutcome.isCorrect
                    ? 'border-[#bde5c1] bg-[#effbf0]'
                    : 'border-[#f0c3c3] bg-[#fff3f3]'
                }`}
              >
                <div className="flex items-center gap-2 font-medium text-[#172519]">
                  {latestOutcome.isCorrect ? <CheckCircle2 className="h-4 w-4 text-[#1fa449]" /> : <XCircle className="h-4 w-4 text-[#d85757]" />}
                  {latestOutcome.isCorrect ? 'Correct response' : 'Incorrect response'}
                </div>
                <p className="mt-2 text-sm leading-7 text-[#536255]">
                  {latestOutcome.changed
                    ? `Difficulty changed from ${latestOutcome.previousDifficulty} to ${latestOutcome.currentDifficulty}.`
                    : `Difficulty stayed at ${latestOutcome.currentDifficulty}.`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#627364]">Answer the first question to see the adaptive engine react.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
