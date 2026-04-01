import { cn } from '../../lib/utils';

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-3 w-full overflow-hidden rounded-full bg-[#edf4ea]', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#2fc84f] via-[#44d056] to-[#ffd24b] transition-all duration-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
