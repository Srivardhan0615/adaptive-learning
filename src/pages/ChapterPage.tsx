import { ArrowRight, BookText, Clock3, Layers3, Sparkles, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { getChapterById, getProgress, getSubjectById, getTopics } from '../lib/supabase';
import type { Chapter, Subject, Topic, UserProgress } from '../types';

export default function ChapterPage() {
  const { subjectId = '', chapterId = '' } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjectById(subjectId), getChapterById(chapterId), getTopics(chapterId), getProgress()]).then(
      ([subjectData, chapterData, topicData, progressData]) => {
        setSubject(subjectData);
        setChapter(chapterData);
        setTopics(topicData);
        setProgress(progressData);
        setLoading(false);
      },
    );
  }, [chapterId, subjectId]);

  const progressByTopic = useMemo(
    () =>
      progress.reduce<Record<string, UserProgress>>((accumulator, item) => {
        accumulator[item.topic_id] = item;
        return accumulator;
      }, {}),
    [progress],
  );

  if (loading) {
    return <Skeleton className="h-[560px] rounded-3xl" />;
  }

  if (!subject || !chapter) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-[#172519]">Chapter not found</h1>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden border-[#dce9d8] bg-[linear-gradient(135deg,#fffef9_0%,#f4fbff_38%,#f6fbf5_70%,#eef9eb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,199,89,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,210,75,0.08),transparent_28%)]" />
        <div className="animate-float-soft absolute right-8 top-8 hidden rounded-[28px] border border-white/50 bg-white/50 p-4 shadow-[0_18px_34px_rgba(41,193,239,0.08)] lg:flex lg:items-center lg:gap-3">
          <Sparkles className="h-5 w-5 text-[#29c1ef]" />
          <div className="text-sm font-semibold text-[#445447]">Topic-by-topic learning path</div>
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <Badge variant="cyan" className="w-fit">
              <BookText className="mr-2 h-3.5 w-3.5" />
              {subject.name} • Chapter {chapter.chapter_number}
            </Badge>
            <h1 className="text-4xl font-bold text-[#172519] md:text-5xl">{chapter.title}</h1>
            <p className="max-w-3xl text-lg text-[#647367]">{chapter.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5 animate-stagger-in">
              <div className="text-sm text-[#728074]">Topics</div>
              <div className="mt-3 text-4xl font-bold text-[#172519]">{topics.length}</div>
            </div>
            <div
              className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5 animate-stagger-in"
              style={{ animationDelay: '90ms' }}
            >
              <div className="text-sm text-[#728074]">Duration</div>
              <div className="mt-3 text-4xl font-bold text-[#2db84b]">{chapter.estimated_hours}h</div>
            </div>
            <div
              className="rounded-[24px] border border-[#dde9da] bg-white/80 p-5 animate-stagger-in"
              style={{ animationDelay: '180ms' }}
            >
              <div className="text-sm text-[#728074]">Level</div>
              <div className="mt-3 text-2xl font-bold capitalize text-[#7dbd17]">{chapter.difficulty_level}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="section-label">Learning Objectives</p>
            <div className="mt-4 space-y-3">
              {chapter.learning_objectives.map((objective) => (
                <div
                  key={objective}
                  className="rounded-2xl border border-[#e1ebde] bg-[#fbfdf9] px-4 py-3 text-sm text-[#536255]"
                >
                  {objective}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="section-label">Prerequisites</p>
            <div className="mt-4 space-y-3">
              {chapter.prerequisites.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#e1ebde] bg-[#fbfdf9] px-4 py-3 text-sm text-[#536255]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => {
          const topicProgress = progressByTopic[topic.id];
          return (
            <Card
              key={topic.id}
              className="card-hover h-full border-[#dce9d8] bg-[linear-gradient(180deg,#ffffff_0%,#f9fcf7_100%)] animate-stagger-in"
              style={{ animationDelay: `${topic.topic_number * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#2eb84c]">
                    Topic {chapter.chapter_number}.{topic.topic_number}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#172519]">{topic.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#647367]">{topic.description}</p>
                </div>
                <Badge variant={topic.difficulty >= 4 ? 'warning' : 'cyan'}>D{topic.difficulty}</Badge>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {topic.key_concepts.map((concept) => (
                  <Badge key={concept} variant="default">
                    {concept}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-[#e1ebde] bg-[#fbfdf9] p-3">
                  <Clock3 className="mx-auto h-4 w-4 text-[#7b8a7e]" />
                  <div className="mt-2 text-sm font-medium text-[#172519]">{topic.estimated_minutes}m</div>
                </div>
                <div className="rounded-2xl border border-[#e1ebde] bg-[#fbfdf9] p-3">
                  <Layers3 className="mx-auto h-4 w-4 text-[#7b8a7e]" />
                  <div className="mt-2 text-sm font-medium text-[#172519]">{topic.difficulty}/5</div>
                </div>
                <div className="rounded-2xl border border-[#e1ebde] bg-[#fbfdf9] p-3">
                  <Target className="mx-auto h-4 w-4 text-[#7b8a7e]" />
                  <div className="mt-2 text-sm font-medium text-[#172519]">
                    {topicProgress?.mastery_percent ?? 0}%
                  </div>
                </div>
              </div>

              <Link to={`/learn/${subject.id}/chapters/${chapter.id}/topics/${topic.id}`} className="mt-6 block">
                <Button className="w-full justify-between">
                  {topicProgress ? 'Continue Topic' : 'Start Topic'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
