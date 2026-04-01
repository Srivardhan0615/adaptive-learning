import { AlertTriangle, ArrowRight, BarChart3, Brain, Clock3, FileSearch, LineChart, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { getSessionById, getSubjectById, getTopicById } from '../lib/supabase';
import { formatDate, humanizeIdentifier, percent } from '../lib/utils';
import type { ConceptPerformance, TestSession } from '../types';

function buildRecommendation(concept: ConceptPerformance) {
  if (concept.accuracy < 40) {
    return 'Relearn the core idea with worked examples before attempting mixed questions.';
  }
  if (concept.accuracy < 70) {
    return 'Practice medium-difficulty questions and explain each step aloud.';
  }
  return 'Maintain this strength with one challenge problem and one review problem.';
}

export default function TestReportPage() {
  const { sessionId = '' } = useParams();
  const [session, setSession] = useState<TestSession | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [topicTitle, setTopicTitle] = useState('');

  useEffect(() => {
    getSessionById(sessionId).then(async (sessionData) => {
      setSession(sessionData);
      if (!sessionData) {
        return;
      }

      const [subject, topic] = await Promise.all([
        getSubjectById(sessionData.subject_id),
        getTopicById(sessionData.topic_id),
      ]);

      setSubjectName(subject?.name ?? humanizeIdentifier(sessionData.subject_id));
      setTopicTitle(topic?.title ?? humanizeIdentifier(sessionData.topic_id));
    });
  }, [sessionId]);

  const summary = useMemo(() => {
    if (!session) {
      return null;
    }

    const total = Math.max(session.answers.length, 1);
    const correct = session.answers.filter((answer) => answer.correct).length;
    const avgTime = Math.round(session.answers.reduce((sum, answer) => sum + answer.time_taken, 0) / total);
    const difficultyBuckets = session.answers.reduce<Record<number, { total: number; correct: number }>>(
      (acc, answer) => {
        const current = acc[answer.difficulty] ?? { total: 0, correct: 0 };
        current.total += 1;
        if (answer.correct) {
          current.correct += 1;
        }
        acc[answer.difficulty] = current;
        return acc;
      },
      {},
    );

    return {
      total,
      correct,
      avgTime,
      accuracy: percent(correct, total),
      difficultyBuckets,
    };
  }, [session]);

  if (!session || !summary) {
    return <Skeleton className="h-[620px] rounded-3xl" />;
  }

  const concepts = [...(session.concept_breakdown ?? [])].sort((a, b) => a.accuracy - b.accuracy);
  const biggestGap = concepts[0];
  const strongestConcept = [...concepts].sort((a, b) => b.accuracy - a.accuracy)[0];
  const readiness =
    session.final_score >= 80
      ? 'Ready for challenge work'
      : session.final_score >= 60
        ? 'Ready for guided consolidation'
        : 'Needs foundation rebuilding';

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e9f9ff] via-transparent to-[#f2ffef]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <Badge variant="cyan" className="w-fit">
              <FileSearch className="mr-2 h-3.5 w-3.5" />
              Separate Test Report
            </Badge>
            <div>
              <h1 className="text-3xl font-bold leading-tight text-[#172519] md:text-4xl">
                {topicTitle} Performance Analysis
              </h1>
              <p className="mt-3 text-lg text-[#627364]">
                {subjectName} • completed on {formatDate(session.completed_at ?? session.started_at)}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-[#dcecdc] bg-[#f8fff8] px-8 py-6 text-center shadow-[0_18px_38px_rgba(58,120,65,0.08)]">
            <div className="text-sm uppercase tracking-[0.2em] text-[#748476]">Overall Score</div>
            <div className="mt-3 text-5xl font-bold text-[#172519]">{session.final_score}%</div>
            <div className="mt-2 text-sm font-medium text-[#29c1ef]">{readiness}</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Brain className="h-5 w-5 text-[#29c1ef]" />
          <div className="mt-4 text-sm text-[#627364]">Ability Estimate</div>
          <div className="mt-2 text-3xl font-bold text-[#172519]">{Math.round(session.ability_estimate)}</div>
        </Card>
        <Card>
          <Clock3 className="h-5 w-5 text-[#f0bd29]" />
          <div className="mt-4 text-sm text-[#627364]">Average Time / Question</div>
          <div className="mt-2 text-3xl font-bold text-[#172519]">{summary.avgTime}s</div>
        </Card>
        <Card>
          <AlertTriangle className="h-5 w-5 text-[#f28b98]" />
          <div className="mt-4 text-sm text-[#627364]">Biggest Gap</div>
          <div className="mt-2 text-xl font-bold text-[#172519]">
            {biggestGap ? humanizeIdentifier(biggestGap.tag) : 'None'}
          </div>
        </Card>
        <Card>
          <ShieldCheck className="h-5 w-5 text-[#58d9a0]" />
          <div className="mt-4 text-sm text-[#627364]">Strongest Area</div>
          <div className="mt-2 text-xl font-bold text-[#172519]">
            {strongestConcept ? humanizeIdentifier(strongestConcept.tag) : 'None'}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#29c1ef]" />
            <h2 className="text-xl font-semibold text-[#172519]">Gap Analysis</h2>
          </div>
          <div className="space-y-4">
            {concepts.map((concept) => (
              <div key={concept.tag} className="rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-[#172519]">
                      {humanizeIdentifier(concept.tag)}
                    </div>
                    <div className="mt-1 text-sm text-[#627364]">
                      {concept.correct}/{concept.total} correct • {concept.status}
                    </div>
                  </div>
                  <Badge
                    variant={concept.accuracy >= 70 ? 'success' : concept.accuracy >= 50 ? 'warning' : 'error'}
                  >
                    {concept.accuracy}%
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#536255]">{buildRecommendation(concept)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-[#94a6ff]" />
            <h2 className="text-xl font-semibold text-[#172519]">Difficulty Breakdown</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(summary.difficultyBuckets)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([difficulty, bucket]) => (
                <div key={difficulty} className="rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-4">
                  <div className="flex items-center justify-between text-[#172519]">
                    <span>Difficulty {difficulty}</span>
                    <span>{percent(bucket.correct, bucket.total)}%</span>
                  </div>
                  <p className="mt-2 text-sm text-[#627364]">
                    {bucket.correct} correct out of {bucket.total} questions
                  </p>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-[#29c1ef]" />
          <h2 className="text-xl font-semibold text-[#172519]">Teacher-Style Summary</h2>
        </div>
        <div className="space-y-4 text-[#536255]">
          <p>
            The student answered {summary.correct} out of {summary.total} questions correctly, giving an overall
            accuracy of {summary.accuracy}%. The adaptive engine finished with an ability estimate of{' '}
            {Math.round(session.ability_estimate)}.
          </p>
          <p>
            The main learning gap is{' '}
            {biggestGap ? humanizeIdentifier(biggestGap.tag) : 'not clearly defined yet'}, which suggests the
            student needs more support on the core reasoning steps for this topic.
          </p>
          <p>
            The strongest performance appeared in{' '}
            {strongestConcept ? humanizeIdentifier(strongestConcept.tag) : 'the available concept set'}, so that
            area can be used as a confidence anchor while rebuilding weaker concepts.
          </p>
          <p>
            Recommended next step: return to the adapted lesson, review the weak concept explanations carefully,
            then retake the topic test after targeted practice.
          </p>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Link to={`/feedback/${session.id}`}>
          <Button variant="outline">Back to Results</Button>
        </Link>
        <Link
          to={`/learn/${session.subject_id}/chapters/${session.chapter_id}/topics/${session.topic_id}`}
          state={{ variant: session.weak_concepts.length ? 'simplified' : 'default' }}
        >
          <Button>
            Review Adapted Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
