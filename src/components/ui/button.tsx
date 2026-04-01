import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-extrabold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35c759] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f6ef] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#2fc84f] to-[#4bd35a] text-white shadow-[0_18px_34px_-18px_rgba(45,181,74,0.55)] hover:-translate-y-0.5 hover:from-[#29bf49] hover:to-[#42cb54]',
        secondary:
          'border border-[#dbe7d8] bg-white text-[#213226] shadow-[0_14px_30px_-22px_rgba(61,99,66,0.28)] hover:border-[#cae5cb] hover:bg-[#f7fcf6]',
        outline:
          'border border-[#cde6ce] bg-[#f2fbf1] text-[#239943] hover:border-[#b8dfbb] hover:bg-[#ebf8ea]',
        ghost: 'bg-transparent text-[#4f6354] hover:bg-[#eef7ec] hover:text-[#172519]',
        success: 'bg-gradient-to-r from-[#25b648] to-[#37cc56] text-white hover:from-[#21a841] hover:to-[#32bf4f]',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 rounded-xl px-3 text-sm',
        lg: 'h-14 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));

Button.displayName = 'Button';

export { Button, buttonVariants };
