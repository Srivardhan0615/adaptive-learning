import { BookOpen, CheckCircle2, Lightbulb, Lock, Rocket, Sparkles, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Lesson, PersonalizedStudyPlan, UserProgress } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

function adaptExplanation(explanation: string, variant: UserProgress['content_variant']) {
  if (variant === 'simplified') {
    return `Support mode\n\n${explanation}\n\nWe slowed the pacing, made the language simpler, and added more explicit guidance between steps.`;
  }
  if (variant === 'accelerated') {
    return `Accelerated mode\n\n${explanation}\n\nThis version removes repetition and asks you to focus on patterns, transfer, and faster reasoning.`;
  }
  return explanation;
}

export default function LessonViewer({
  lesson,
  progress,
  studyPlan,
  onQuickCheckComplete,
  quickCheckPassed,
  onStartTest,
}: {
  lesson: Lesson;
  progress?: UserProgress;
  studyPlan?: PersonalizedStudyPlan;
  onQuickCheckComplete: (passed: boolean, score: number) => void;
  quickCheckPassed: boolean;
  onStartTest: () => void;
}) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const quickCheckScore = useMemo(
    () =>
      answers.reduce((count, answer, index) => {
        if (lesson.content_json.quick_check[index]?.correct === answer) {
          return count + 1;
        }
        return count;
      }, 0),
    [answers, lesson.content_json.quick_check],
  );

  const variant = progress?.content_variant ?? 'default';
  const passed = quickCheckScore >= 2;

  function submitQuickCheck() {
    setSubmitted(true);
    onQuickCheckComplete(passed, quickCheckScore);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <Badge variant={variant === 'simplified' ? 'warning' : variant === 'accelerated' ? 'indigo' : 'cyan'} className="w-fit">
              {variant === 'simplified' ? 'Personalized Support Lesson' : variant === 'accelerated' ? 'Accelerated Lesson' : 'Standard Lesson'}
            </Badge>
            <div>
              <h1 className="text-2xl font-bold text-[#172519] sm:text-3xl md:text-4xl">{lesson.title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#627364] sm:text-lg sm:leading-8">{lesson.content_json.big_idea}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-[#d9ead9] bg-[#f7fff7] px-4 py-4 text-left shadow-[0_16px_36px_rgba(58,120,65,0.08)] sm:px-5 md:text-right">
            <div className="text-sm text-[#738374]">Quick check status</div>
            <div className="mt-2 text-2xl font-bold text-[#172519]">{quickCheckPassed ? 'Unlocked' : 'Locked'}</div>
          </div>
        </div>
      </Card>

      {studyPlan ? (
        <Card className="border-[#d8ebf5] bg-gradient-to-br from-[#eef9ff] via-white to-[#f3fff1]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[#29c1ef]">
                <Sparkles className="h-5 w-5" />
                <span className="section-label">Score Boost Plan</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight text-[#172519] sm:text-3xl">{studyPlan.headline}</h2>
              <p className="mt-3 text-sm leading-7 text-[#536255] sm:text-base">
                {studyPlan.summary}
              </p>
            </div>
            <div className="rounded-[24px] border border-[#d6ebf3] bg-white/90 px-4 py-4 text-left lg:min-w-[220px] lg:text-right">
              <div className="text-xs uppercase tracking-[0.2em] text-[#78908d]">Projected Gain</div>
              <div className="mt-2 text-4xl font-bold text-[#10a8d7]">+{studyPlan.projected_score_gain}%</div>
              <div className="mt-2 text-sm text-[#627364]">Target around {studyPlan.target_score}% next time</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {studyPlan.action_steps.map((step) => (
              <div key={step} className="rounded-[22px] border border-[#dcecdc] bg-white/90 px-4 py-3 text-sm leading-7 text-[#536255]">
                {step}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="mb-4 flex items-center gap-3 text-[#29c1ef]">
          <Lightbulb className="h-5 w-5" />
          <span className="section-label">Big Idea</span>
        </div>
        <h2 className="text-2xl font-bold leading-tight text-[#172519] sm:text-3xl">{lesson.content_json.big_idea}</h2>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3 text-[#29c1ef]">
          <BookOpen className="h-5 w-5" />
          <span className="section-label">Explanation</span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-7 text-[#4e5f51] sm:text-base sm:leading-8">
          {adaptExplanation(lesson.content_json.explanation, variant)}
        </div>
      </Card>

      <Card className="border-[#dce8f7] bg-gradient-to-br from-[#eef8ff] via-white to-[#f2ffef]">
        <div className="mb-4 flex items-center gap-3 text-[#29c1ef]">
          <Sparkles className="h-5 w-5" />
          <span className="section-label">Worked Example</span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-7 text-[#435445] sm:text-base sm:leading-8">{lesson.content_json.worked_example}</div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center gap-3 text-[#29c1ef]">
          <Rocket className="h-5 w-5" />
          <span className="section-label">Key Skills</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {lesson.content_json.key_skills.map((skill) => (
            <Badge key={skill} variant="cyan">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="mt-6 grid gap-3">
          {lesson.content_json.remember_points.map((point) => (
            <div
              key={point}
              className="rounded-[22px] border border-[#dcecdc] bg-[#f8fff8] px-4 py-3 text-sm leading-7 text-[#536255]"
            >
              {point}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3 text-[#29c1ef]">
              <Target className="h-5 w-5" />
              <span className="section-label">Quick Check Gate</span>
            </div>
            <h3 className="text-xl font-semibold text-[#172519] sm:text-2xl">Answer 2 of 3 correctly to unlock the adaptive test</h3>
            <p className="mt-2 text-sm leading-7 text-[#627364]">
              The test stays locked until the learner shows enough understanding to move into adaptive assessment.
            </p>
          </div>
          <Badge variant={quickCheckPassed ? 'success' : 'warning'}>
            {quickCheckScore}/{lesson.content_json.quick_check.length} correct
          </Badge>
        </div>

        <div className="space-y-4">
          {lesson.content_json.quick_check.map((item, questionIndex) => (
            <div key={item.question} className="rounded-[24px] border border-[#dcecdc] bg-[#fbfffb] p-5">
              <div className="mb-4 text-sm font-semibold leading-7 text-[#172519] sm:text-base">{item.question}</div>
              <div className="grid gap-3 md:grid-cols-2">
                {item.options.map((option, optionIndex) => {
                  const selected = answers[questionIndex] === optionIndex;
                  const reveal = submitted && item.correct === optionIndex;
                  const wrong = submitted && selected && optionIndex !== item.correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => {
                          const next = [...current];
                          next[questionIndex] = optionIndex;
                          return next;
                        })
                      }
                      className={[
                        'rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-200',
                        selected
                          ? 'border-[#2fc84f] bg-[#effbf0] text-[#172519] shadow-[0_12px_24px_rgba(47,200,79,0.12)]'
                          : 'border-[#d9e8d9] bg-white text-[#435445] hover:border-[#bee6c4] hover:bg-[#f7fff7]',
                        reveal ? 'border-[#1fa449] bg-[#effbf0] text-[#145c26]' : '',
                        wrong ? 'border-[#e57d7d] bg-[#fff1f1] text-[#8c3030]' : '',
                      ].join(' ')}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row">
          <Button className="flex-1" size="lg" onClick={submitQuickCheck} disabled={answers.length < lesson.content_json.quick_check.length}>
            {quickCheckPassed ? 'Quick Check Passed' : 'Submit Quick Check'}
          </Button>
          <Button className="flex-1" size="lg" variant="success" onClick={onStartTest} disabled={!quickCheckPassed}>
            Start Adaptive Test
          </Button>
        </div>

        {submitted && (
          <div
            className={`mt-5 rounded-[24px] border p-4 text-sm leading-7 ${
              passed
                ? 'border-[#bde5c1] bg-[#effbf0] text-[#145c26]'
                : 'border-[#f2dd9f] bg-[#fff7db] text-[#7a5a09]'
            }`}
          >
            {passed
              ? `You got ${quickCheckScore} out of ${lesson.content_json.quick_check.length}. The adaptive test is now unlocked.`
              : `You got ${quickCheckScore} out of ${lesson.content_json.quick_check.length}. Review the explanation and worked example, then try again.`}
          </div>
        )}
      </Card>

      {!quickCheckPassed && (
        <Card className="border-[#f1e1ad] bg-[#fffaf0]">
          <div className="flex items-center gap-3 text-[#5b6630]">
            <Lock className="h-5 w-5 text-[#d29a10]" />
            The adaptive test is still locked. Complete the quick check first.
          </div>
        </Card>
      )}

      {quickCheckPassed && (
        <Card className="border-[#bde5c1] bg-[#effbf0]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#1fa449]" />
              <div>
                <h3 className="text-lg font-semibold text-[#172519]">Test unlocked</h3>
                <p className="mt-1 text-sm leading-7 text-[#536255]">
                  You are ready for the live adaptive assessment. Difficulty will rise after two correct answers
                  and drop after two incorrect answers.
                </p>
              </div>
            </div>
            <Button variant="success" onClick={onStartTest}>
              Start now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
