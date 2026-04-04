import { ArrowRight, CheckCircle2, CircleHelp, Sparkles, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LessonViewer from '../components/Learning/LessonViewer';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { generateVariantContent, getVariantBadgeLabel, getVariantWhyMessage } from '../lib/adaptiveContent';
import {
  createTestSession,
  getLessons,
  getLessonVariant,
  getProgress,
  getQuickCheckStatus,
  getTopicById,
  saveLessonVariant,
  saveProgress,
  setQuickCheckStatus,
} from '../lib/supabase';
import type { ContentVariant, ContentVariantType, Lesson, Topic, UserProgress } from '../types';

export default function LessonPage() {
  const { subjectId = '', chapterId = '', topicId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickCheckPassed, setQuickCheckPassed] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<ContentVariantType>('default');
  const [activeVariantRecord, setActiveVariantRecord] = useState<ContentVariant | null>(null);
  const requestedVariant = (location.state?.variant as ContentVariantType | undefined) ?? 'default';

  useEffect(() => {
    Promise.all([getLessons(topicId), getProgress(), getTopicById(topicId)]).then(async ([lessonData, progressData, topicData]) => {
      let resolvedVariant: ContentVariantType = requestedVariant;

      if (lessonData[0]) {
        let variant =
          requestedVariant !== 'default'
            ? await getLessonVariant(
                lessonData[0].id,
                requestedVariant === 'remedial' ? 'simplified' : requestedVariant,
              )
            : await getLessonVariant(lessonData[0].id);

        if (!variant) {
          resolvedVariant = 'default';
        } else if (requestedVariant === 'default') {
          resolvedVariant = variant.variant_type;
        } else {
          resolvedVariant = requestedVariant;
        }

        if (!variant && requestedVariant !== 'default') {
          const normalizedVariant = requestedVariant === 'remedial' ? 'simplified' : requestedVariant;
          variant = {
            user_id: progressData[0]?.user_id ?? 'demo-user',
            lesson_id: lessonData[0].id,
            concept_tag: lessonData[0].concept_tag,
            variant_type: normalizedVariant,
            content_json: generateVariantContent(lessonData[0], normalizedVariant, lessonData[0].concept_tag),
            weak_concepts:
              normalizedVariant === 'simplified'
                ? [lessonData[0].concept_tag]
                : [],
            created_at: new Date().toISOString(),
          };
          await saveLessonVariant(variant);
          resolvedVariant = requestedVariant;
        }

        if (variant) {
          lessonData = lessonData.map((lesson) =>
            lesson.id === variant.lesson_id ? { ...lesson, content_json: variant.content_json } : lesson,
          );
        }
      }

      setTopic(topicData);
      setLessons(lessonData);
      setProgress(progressData);
      setActiveVariant(resolvedVariant);
      setActiveVariantRecord(lessonData[0] ? (await getLessonVariant(lessonData[0].id, resolvedVariant === 'remedial' ? 'simplified' : resolvedVariant)) ?? null : null);
      setLoading(false);
      if (lessonData[0]) {
        setQuickCheckPassed(await getQuickCheckStatus(lessonData[0].id));
      }
    });
  }, [requestedVariant, topicId]);

  const lesson = lessons[0];
  const progressItem = useMemo(() => {
    if (!lesson) {
      return undefined;
    }
    const existing = progress.find((item) => item.lesson_id === lesson.id);
    if (existing) {
      return location.state?.variant ? { ...existing, content_variant: location.state.variant } : existing;
    }
    return undefined;
  }, [lesson, location.state, progress]);

  async function handleQuickCheckComplete(passed: boolean, score: number) {
    if (!lesson) {
      return;
    }

    setQuickCheckPassed(passed);
    await setQuickCheckStatus(lesson.id, passed);
    const nextProgress: UserProgress = {
      id: progressItem?.id ?? crypto.randomUUID(),
      user_id: progressItem?.user_id ?? 'demo-user',
      lesson_id: lesson.id,
      status: passed ? 'completed' : 'in_progress',
      mastery_percent: Math.max(score * 33, progressItem?.mastery_percent ?? 0),
      last_accessed: new Date().toISOString(),
      content_variant:
        ((activeVariant === 'remedial' ? 'simplified' : activeVariant) as UserProgress['content_variant']) ??
        progressItem?.content_variant ??
        'default',
      topic_id: lesson.topic_id,
      chapter_id: lesson.chapter_id,
      subject_id: lesson.subject_id,
    };

    setProgress((items) => {
      const filtered = items.filter((item) => item.lesson_id !== lesson.id);
      return [...filtered, nextProgress];
    });
    await saveProgress(nextProgress);
  }

  async function handleStartTest() {
    const session = await createTestSession(topicId);
    navigate(`/test/${session.id}`, {
      state: {
        topicId,
        chapterId: lesson?.chapter_id,
        subjectId,
        userId: session.user_id,
      },
    });
  }

  if (loading) {
    return <Skeleton className="h-[520px] rounded-3xl" />;
  }

  if (!lesson) {
    return (
      <Card>
        <h1 className="text-2xl font-bold">No lesson available yet</h1>
      </Card>
    );
  }

  const sidebarSteps = [
    { name: 'Big Idea', icon: Sparkles },
    { name: 'Explanation', icon: CircleHelp },
    { name: 'Worked Example', icon: Target },
    { name: 'Key Skills', icon: CheckCircle2 },
    { name: 'Quick Check', icon: ArrowRight },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <Card className="sticky top-28 space-y-6">
          <div>
            <p className="section-label">Lesson Roadmap</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#172519]">{lesson.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#627364]">
              {topic?.description ?? 'Five-step instruction flow with gated assessment access.'}
            </p>
          </div>

          <div className="space-y-3">
            {sidebarSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.name}
                  className="flex items-center gap-3 rounded-[24px] border border-[#d8ead9] bg-white px-4 py-3 shadow-[0_16px_38px_rgba(58,120,65,0.08)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#effbf0] text-[#2fc84f]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#172519]">{step.name}</div>
                    <div className="text-xs text-[#7b8b7d]">Step {index + 1}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`rounded-[26px] border p-4 ${
              quickCheckPassed
                ? 'border-[#bde5c1] bg-[#effbf0]'
                : 'border-[#f4e1a7] bg-[#fff7db]'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[#172519]">
              {quickCheckPassed ? <CheckCircle2 className="h-4 w-4 text-[#1fa449]" /> : <Target className="h-4 w-4 text-[#d29a10]" />}
              {quickCheckPassed ? 'Adaptive test unlocked' : 'Quick check required'}
            </div>
            <p className="mt-2 text-xs leading-6 text-[#627364]">
              {quickCheckPassed
                ? 'You can move into the adaptive test any time.'
                : 'Learners must pass the quick check before starting the assessment.'}
            </p>
          </div>
        </Card>
      </aside>

      <section className="space-y-6">
        <Card className="overflow-hidden">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge
                variant={
                  activeVariant === 'simplified'
                    ? 'warning'
                    : activeVariant === 'accelerated'
                      ? 'indigo'
                      : 'cyan'
                }
                className="w-fit"
              >
                {getVariantBadgeLabel(activeVariant)}
              </Badge>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#627364] sm:text-base sm:leading-8">
                {activeVariantRecord?.study_plan?.summary ??
                  'Topic-based personalization is now applied before the learner starts the next test, so each lesson can respond to chapter and concept performance, not just subject-level results.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWhyOpen((value) => !value)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#22833e] transition hover:text-[#172519]"
            >
              <CircleHelp className="h-4 w-4" />
              Why am I seeing this?
            </button>
          </div>

          {whyOpen && (
            <div className="mt-5 rounded-[24px] border border-[#dcecdc] bg-[#f7fff7] p-4 text-sm leading-7 text-[#536255]">
              {getVariantWhyMessage(activeVariant)}
              {activeVariant !== requestedVariant && requestedVariant === 'default' ? ' Your last completed test saved this personalized version for future visits.' : ''}
            </div>
          )}
        </Card>

        {activeVariantRecord?.study_plan ? (
          <Card className="border-[#d7ecf6] bg-gradient-to-br from-[#eefaff] to-[#f8fff4]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="section-label">Personalized Plan</p>
                <h3 className="mt-3 text-xl font-semibold text-[#172519] sm:text-2xl">
                  {activeVariantRecord.study_plan.headline}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6e61]">
                  Focus on {activeVariantRecord.study_plan.focus_concepts.map((concept) => concept.replace(/_/g, ' ')).join(', ')} and target about{' '}
                  <span className="font-semibold text-[#0f9ec7]">{activeVariantRecord.study_plan.projected_score_gain}%</span> score improvement.
                </p>
              </div>
              <div className="rounded-[22px] border border-[#cfe5ef] bg-white/90 px-4 py-3 text-left md:min-w-[180px] md:text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-[#7d8e82]">Target Score</div>
                <div className="mt-2 text-3xl font-bold text-[#172519]">{activeVariantRecord.study_plan.target_score}%</div>
              </div>
            </div>
          </Card>
        ) : null}

        <LessonViewer
          lesson={lesson}
          progress={progressItem}
          studyPlan={activeVariantRecord?.study_plan}
          onQuickCheckComplete={handleQuickCheckComplete}
          quickCheckPassed={quickCheckPassed}
          onStartTest={handleStartTest}
        />

        <Card className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-[#172519]">Ready for the adaptive assessment?</h3>
            <p className="mt-2 text-sm leading-7 text-[#627364] sm:text-base sm:leading-8">
              The next test will stay aligned to the topic concept tag{' '}
              <span className="font-semibold text-[#10a8d7]">{lesson.concept_tag}</span> while adjusting
              difficulty in real time.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to={`/learn/${subjectId}`}>
              <Button variant="outline" className="w-full sm:w-auto">Back to subjects</Button>
            </Link>
            <Link to={`/learn/${subjectId}/chapters/${chapterId}`}>
              <Button variant="outline" className="w-full sm:w-auto">Back to topics</Button>
            </Link>
            <Button onClick={handleStartTest} disabled={!quickCheckPassed} className="w-full sm:w-auto">
              Start Test
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
