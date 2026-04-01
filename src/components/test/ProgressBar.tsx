import { cn } from '../../lib/utils';

export default function TestProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-1 gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-2 flex-1 rounded-full transition-all duration-300',
            index < current ? 'bg-[#29c1ef]' : index === current ? 'bg-[#9ae2f6]' : 'bg-[#e0ece1]',
          )}
        />
      ))}
    </div>
  );
}
