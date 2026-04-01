import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

export default function ConceptCard({
  concept,
  value,
  tone = 'warning',
}: {
  concept: string;
  value: number;
  tone?: 'warning' | 'success';
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold capitalize text-[#172519]">{concept.replace(/_/g, ' ')}</div>
        <Badge variant={tone === 'success' ? 'success' : 'warning'}>
          {tone === 'success' ? 'Strong' : 'Needs work'}
        </Badge>
      </div>
      <Progress value={value} />
      <div className="text-sm text-[#627364]">{value}% accuracy</div>
    </Card>
  );
}
