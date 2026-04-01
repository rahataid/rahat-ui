import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border-none px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary shadow-neu-extruded-xs',
        secondary:
          'bg-secondary text-secondary-foreground shadow-neu-extruded-xs hover:shadow-neu-hover',
        destructive:
          'bg-destructive/10 text-destructive shadow-neu-extruded-xs',
        outline: 'text-foreground shadow-neu-extruded-xs',
        success:
          'bg-success/10 text-success shadow-neu-extruded-xs',
        warning:
          'bg-warning/10 text-warning shadow-neu-extruded-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
