import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#deeadb] bg-[#f8fbf6] text-[#4e6151]',
        cyan: 'border-[#b8e8bb] bg-[#e9fbe9] text-[#2cab4a]',
        indigo: 'border-[#cae7c3] bg-[#f1fbec] text-[#489f41]',
        success: 'border-[#b4ebb9] bg-[#e4fbe8] text-[#279f47]',
        warning: 'border-[#ffe59a] bg-[#fff7d8] text-[#b28408]',
        error: 'border-[#ffc5d1] bg-[#fff0f4] text-[#d85274]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
