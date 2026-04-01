import * as React from 'react';

import { cn } from '../../utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border-none bg-background px-3 py-2 text-sm shadow-neu-inset-sm transition-shadow duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-neu-pressed focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
