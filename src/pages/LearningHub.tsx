import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SubjectCard from '../components/Learning/SubjectCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { getProgress, getSubjects } from '../lib/supabase';
import type { Subject, UserProgress } from '../types';

export default function LearningHub() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjects(), getProgress()]).then(([subjectData, progressData]) => {
      setSubjects(subjectData);
      setProgress(progressData);
      setLoading(false);
    });
  }, []);

  const progressBySubject = useMemo(
    () =>
      progress.reduce<Record<string, number>>((accumulator, item) => {
        const current = accumulator[item.subject_id] ?? 0;
        accumulator[item.subject_id] = Math.max(current, item.mastery_percent);
        return accumulator;
      }, {}),
    [progress],
  );

  const averageProgress = useMemo(() => {
    if (!progress.length) {
      return 0;
    }
    return Math.round(progress.reduce((sum, item) => sum + item.mastery_percent, 0) / progress.length);
  }, [progress]);

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden border-[#dce9d8] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf5_60%,#eef9eb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,199,89,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,210,75,0.08),transparent_28%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <Badge variant="cyan" className="w-fit">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Learning Hub
            </Badge>
            <h1 className="text-4xl font-bold text-[#172519] md:text-5xl">Choose your next adaptive learning path</h1>
            <p className="max-w-3xl text-[#647367]">
              Explore a full intermediate curriculum organized by subject, chapter, and topic. Each topic
              includes a guided lesson, a quick check, and an adaptive assessment.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5">
              <div className="text-sm text-[#728074]">Average mastery</div>
              <div className="mt-3 text-4xl font-bold text-[#172519]">{averageProgress}%</div>
            </div>
            <div className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5">
              <div className="text-sm text-[#728074]">Subjects available</div>
              <div className="mt-3 text-4xl font-bold text-[#2db84b]">{subjects.length || 3}</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-3xl" />)
            : subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} progress={progressBySubject[subject.id] ?? 0} />
              ))}
        </section>

        <aside className="space-y-6">
          <Card>
            <p className="section-label">How It Works</p>
            <div className="mt-5 space-y-4">
              {[
                'Choose a subject, then move chapter by chapter.',
                'Open a topic lesson and pass the quick check.',
                'Use the adaptive test results to trigger a personalized follow-up lesson.',
              ].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf9ea] text-sm font-semibold text-[#2fb84d]">
                    {index + 1}
                  </div>
                  <p className="text-sm text-[#536255]">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-[#172519]">Suggested next move</h2>
            <p className="mt-3 text-sm text-[#647367]">
              Stay inside one subject for a few topics in a row so the adaptive engine can build a more stable
              picture of your strengths and gaps.
            </p>
            <Link to={`/learn/${subjects[0]?.id ?? 'subject-mathematics'}`} className="mt-5 block">
              <Button className="w-full justify-between">
                Resume recommended path
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
