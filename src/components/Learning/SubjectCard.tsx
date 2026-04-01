import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { iconMap } from '../../lib/sampleData';
import type { Subject } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

export default function SubjectCard({ subject, progress }: { subject: Subject; progress?: number }) {
  const Icon = iconMap[subject.icon as keyof typeof iconMap] ?? iconMap.Book;
  const actionLabel = progress && progress > 0 ? (progress >= 100 ? 'Review mastery' : 'Continue path') : 'Start learning';
  const badgeVariant = subject.difficultyLabel === 'Easy' ? 'success' : subject.difficultyLabel === 'Hard' ? 'error' : 'warning';

  return (
    <Card className="card-hover group relative h-full overflow-hidden border-[#dce9d8] bg-[linear-gradient(180deg,#ffffff_0%,#f9fcf7_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,199,89,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,210,75,0.1),transparent_28%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader>
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-[24px] border border-[#cce8c9] bg-gradient-to-br from-[#ecfaea] to-[#fffce8] p-4 shadow-[0_16px_36px_-24px_rgba(61,113,66,0.24)]">
            <Icon className="h-8 w-8 text-[#30bc4b]" />
          </div>
          <Badge variant={badgeVariant}>{subject.difficultyLabel}</Badge>
        </div>
        <CardTitle>{subject.name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-10">{subject.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between text-xs uppercase tracking-[0.18em] text-[#7d8b80]">
            <span>{subject.category}</span>
            <span>{subject.estimated_minutes} min</span>
          </div>
          <Progress value={progress ?? 0} />
          <div className="flex items-center justify-between text-sm text-[#647367]">
            <span>{progress ?? 0}% complete</span>
            <span>{progress && progress > 65 ? 'On track' : 'Support ready'}</span>
          </div>
        </div>
        <Link to={`/learn/${subject.id}`} className="block">
          <Button className="w-full justify-between">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
