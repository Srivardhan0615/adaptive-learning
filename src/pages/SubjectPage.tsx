import { ArrowRight, Atom, BookOpenCheck, Clock3, Layers3, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { getChapters, getProgress, getSubjectById } from '../lib/supabase';
import type { Chapter, Subject, UserProgress } from '../types';

export default function SubjectPage() {
  const { subjectId = '' } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjectById(subjectId), getChapters(subjectId), getProgress()]).then(([subjectData, chapterData, progressData]) => {
      setSubject(subjectData);
      setChapters(chapterData);
      setProgress(progressData);
      setLoading(false);
    });
  }, [subjectId]);

  const progressByChapter = useMemo(
    () =>
      progress.reduce<Record<string, { total: number; count: number }>>((accumulator, item) => {
        const current = accumulator[item.chapter_id] ?? { total: 0, count: 0 };
        accumulator[item.chapter_id] = {
          total: current.total + item.mastery_percent,
          count: current.count + 1,
        };
        return accumulator;
      }, {}),
    [progress],
  );

  if (loading) {
    return <Skeleton className="h-[560px] rounded-3xl" />;
  }

  if (!subject) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-[#172519]">Subject not found</h1>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden border-[#dce9d8] bg-[linear-gradient(135deg,#f9fffd_0%,#eff8ff_35%,#f6fbf5_68%,#eef9eb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,199,89,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,210,75,0.1),transparent_28%)]" />
        <div className="animate-float-soft absolute -right-8 top-10 hidden h-32 w-32 rounded-[32px] bg-[linear-gradient(135deg,rgba(46,184,76,0.14),rgba(41,193,239,0.12))] blur-sm lg:block" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <Badge variant="cyan" className="w-fit">
              <BookOpenCheck className="mr-2 h-3.5 w-3.5" />
              {subject.name}
            </Badge>
            <h1 className="text-4xl font-bold text-[#172519] md:text-5xl">{subject.name} Curriculum Map</h1>
            <p className="max-w-3xl text-lg text-[#647367]">{subject.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7ebd8] bg-white/80 px-4 py-2 text-sm text-[#536255]">
                <Atom className="h-4 w-4 text-[#29c1ef]" />
                Structured chapter journey
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7ebd8] bg-white/80 px-4 py-2 text-sm text-[#536255]">
                <Sparkles className="h-4 w-4 text-[#2fc84f]" />
                Personalized topic follow-up
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5 animate-stagger-in">
              <div className="text-sm text-[#728074]">Chapters</div>
              <div className="mt-3 text-4xl font-bold text-[#172519]">{chapters.length}</div>
            </div>
            <div className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5 animate-stagger-in" style={{ animationDelay: '90ms' }}>
              <div className="text-sm text-[#728074]">Tracked progress items</div>
              <div className="mt-3 text-4xl font-bold text-[#2db84b]">{progress.length}</div>
            </div>
            <div className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5 animate-stagger-in" style={{ animationDelay: '180ms' }}>
              <div className="text-sm text-[#728074]">Estimated time</div>
              <div className="mt-3 text-4xl font-bold text-[#7dbd17]">{subject.estimated_minutes}m</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {chapters.map((chapter) => {
          const chapterProgress = progressByChapter[chapter.id];
          const chapterAverage = chapterProgress ? Math.round(chapterProgress.total / Math.max(chapterProgress.count, 1)) : 0;

          return (
            <Card key={chapter.id} className="space-y-5 border-[#dce9d8] bg-[linear-gradient(180deg,#ffffff_0%,#fbfef8_100%)] animate-stagger-in" style={{ animationDelay: `${chapter.chapter_number * 80}ms` }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="section-label">Chapter {chapter.chapter_number}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#172519]">{chapter.title}</h2>
                  <p className="mt-2 max-w-3xl text-[#647367]">{chapter.description}</p>
                </div>
                <div className="flex gap-3">
                  <Badge variant="indigo">
                    <Clock3 className="mr-2 h-3.5 w-3.5" />
                    {chapter.estimated_hours} hrs
                  </Badge>
                  <Badge variant="warning">
                    <Layers3 className="mr-2 h-3.5 w-3.5" />
                    {chapter.difficulty_level}
                  </Badge>
                </div>
              </div>

              <Card className="border-[#dfeadb] bg-[linear-gradient(180deg,#ffffff_0%,#f5fff4_100%)]">
                <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
                  <div>
                    <p className="text-sm leading-7 text-[#647367]">
                      Open this chapter to view all topics in order, read the learning objectives, and
                      study each topic one by one in a cleaner structure.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {chapter.learning_objectives.map((objective) => (
                        <Badge key={objective} variant="default">
                          {objective}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-[#728074]">
                      <span>{chapter.estimated_hours} hours</span>
                      <span>{chapterAverage}% average mastery</span>
                    </div>
                    <Link to={`/learn/${subject.id}/chapters/${chapter.id}`} className="block">
                      <Button className="w-full justify-between">
                        Open Chapter Topics
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
