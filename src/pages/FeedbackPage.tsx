import { ArrowRight, FileSearch, RotateCcw, Sparkles, Target, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ConceptCard from '../components/Learning/ConceptCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { categorizeConcepts } from '../lib/adaptiveContent';
import { describeAbility } from '../lib/adaptiveAlgorithm';
import { getSessionById } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import type { TestSession } from '../types';

export default function FeedbackPage() {
  const { sessionId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<TestSession | null>(
    (location.state?.session as TestSession | undefined) ?? null,
  );

  useEffect(() => {
    if (!session) {
      getSessionById(sessionId).then(setSession);
    }
  }, [session, sessionId]);

  const elapsedMinutes = useMemo(() => {
    if (!session?.completed_at) {
      return 0;
    }
    const diff = new Date(session.completed_at).getTime() - new Date(session.started_at).getTime();
    return Math.max(1, Math.round(diff / 60000));
  }, [session]);

  if (!session) {
    return <Skeleton className="h-[460px] rounded-3xl" />;
  }

  const conceptBreakdown = session.concept_breakdown ?? [];
  const { strongConcepts, weakConcepts } = categorizeConcepts(conceptBreakdown);
  const strongItems = conceptBreakdown.filter((concept) => strongConcepts.includes(concept.tag));
  const weakItems = conceptBreakdown.filter((concept) => weakConcepts.includes(concept.tag));
  const studyPlan = session.study_plan;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e9f9ff] via-transparent to-[#f2ffef]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <Badge variant="cyan" className="w-fit">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Results Ready
            </Badge>
            <div>
              <h1 className="text-2xl font-bold leading-tight text-[#172519] sm:text-3xl md:text-4xl">
                You performed at {describeAbility(session.ability_estimate)} level
              </h1>
              <p className="mt-3 text-base text-[#627364] sm:text-lg">
                Completed on {formatDate(session.completed_at ?? session.started_at)} in {elapsedMinutes} minutes.
              </p>
            </div>
          </div>

          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-[#29c1ef]/25 bg-[#253048] text-center shadow-[0_18px_44px_rgba(41,193,239,0.18)] sm:h-40 sm:w-40 md:h-44 md:w-44 md:border-[12px]">
            <div>
              <div className="text-4xl font-bold text-white sm:text-5xl">{session.final_score}%</div>
              <div className="mt-2 text-sm text-[#b8c6d7]">Score</div>
            </div>
          </div>
        </div>
      </Card>

      {studyPlan ? (
        <Card className="border-[#d7edf6] bg-gradient-to-br from-[#eef8ff] to-[#f7fff1]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="section-label">Personalized Recommendation</p>
              <h2 className="mt-3 text-xl font-semibold text-[#172519] sm:text-2xl">{studyPlan.headline}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5d6d61] sm:text-base">
                {studyPlan.summary}
              </p>
            </div>
            <div className="rounded-[24px] border border-[#d2eaf3] bg-white/90 px-4 py-4 text-left lg:min-w-[220px] lg:text-right">
              <div className="text-xs uppercase tracking-[0.2em] text-[#7d8d83]">Possible Lift</div>
              <div className="mt-2 text-4xl font-bold text-[#10a8d7]">+{studyPlan.projected_score_gain}%</div>
              <div className="mt-2 text-sm text-[#627364]">Target score {studyPlan.target_score}%</div>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#58d9a0]" />
            <h2 className="text-xl font-semibold text-[#172519]">Strong Areas</h2>
          </div>
          <div className="space-y-4">
            {strongItems.length ? (
              strongItems.map((concept) => (
                <ConceptCard key={concept.tag} concept={concept.tag} value={concept.accuracy} tone="success" />
              ))
            ) : (
              <div className="rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-5 text-sm text-[#627364]">
                Keep practicing to build your first strong area.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#f0bd29]" />
            <h2 className="text-xl font-semibold text-[#172519]">Focus Areas</h2>
          </div>
          <div className="space-y-4">
            {weakItems.length ? (
              weakItems.map((concept) => (
                <ConceptCard key={concept.tag} concept={concept.tag} value={concept.accuracy} tone="warning" />
              ))
            ) : (
              <div className="rounded-[24px] border border-[#dcecdc] bg-[#f8fff8] p-5 text-sm text-[#627364]">
                Great job. No weak concepts were detected in this session.
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        <Card className="card-hover cursor-pointer" onClick={() => navigate(-1)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#172519]">Review mistakes</h3>
              <p className="mt-2 text-sm leading-7 text-[#627364]">
                Step back through the test flow and use the explanations to understand where answers broke down.
              </p>
            </div>
            <RotateCcw className="h-5 w-5 text-[#8a9b8d]" />
          </div>
        </Card>

        <Link to={`/report/${session.id}`}>
          <Card className="card-hover h-full cursor-pointer border-[#dcecdc] bg-[#f8fff8]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#172519]">Open full report</h3>
                <p className="mt-2 text-sm leading-7 text-[#627364]">
                  View detailed gap analysis, difficulty breakdown, and teacher-style recommendations.
                </p>
              </div>
              <FileSearch className="h-5 w-5 text-[#29c1ef]" />
            </div>
          </Card>
        </Link>

        <Link
          to={`/learn/${session.subject_id}/chapters/${session.chapter_id}/topics/${session.topic_id}`}
          state={{
            variant: studyPlan?.variant_type ?? (weakItems.length ? 'simplified' : strongItems.length ? 'accelerated' : 'default'),
          }}
        >
          <Card className="card-hover h-full cursor-pointer border-[#cfe9f3] bg-gradient-to-br from-[#eafaff] to-[#f2ffef]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#172519]">Continue to adapted lesson</h3>
                <p className="mt-2 text-sm leading-7 text-[#627364]">
                  {studyPlan
                    ? `A personalized lesson is ready for ${studyPlan.focus_concepts.map((concept) => concept.replace(/_/g, ' ')).join(', ')} with a target gain of about ${studyPlan.projected_score_gain}%.`
                    : weakItems.length
                      ? `A personalized support lesson is ready for ${weakItems.map((concept) => concept.tag.replace(/_/g, ' ')).join(', ')}.`
                      : 'You are ready for an accelerated version of the lesson with less repetition and more challenge.'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#29c1ef]" />
            </div>
          </Card>
        </Link>
      </div>

      <div className="flex justify-end">
        <Link
          to={`/learn/${session.subject_id}/chapters/${session.chapter_id}/topics/${session.topic_id}`}
          state={{
            variant: studyPlan?.variant_type ?? (weakItems.length ? 'simplified' : strongItems.length ? 'accelerated' : 'default'),
          }}
        >
          <Button size="lg">
            Open Adapted Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
