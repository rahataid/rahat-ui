import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground rounded-xl shadow-neu-extruded-sm hover:shadow-neu-hover active:shadow-neu-pressed active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground rounded-xl shadow-neu-extruded-sm hover:shadow-neu-hover active:shadow-neu-pressed active:scale-[0.98]',
        outline:
          'border-none bg-background text-foreground rounded-xl shadow-neu-extruded-sm hover:shadow-neu-hover active:shadow-neu-pressed active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground rounded-xl shadow-neu-extruded-sm hover:shadow-neu-hover active:shadow-neu-pressed active:scale-[0.98]',
        ghost:
          'rounded-xl hover:bg-accent/50 hover:text-accent-foreground active:shadow-neu-inset-sm',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 rounded-xl px-4 py-2',
        sm: 'h-9 rounded-xl px-3 text-xs',
        lg: 'h-11 rounded-xl px-8',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
