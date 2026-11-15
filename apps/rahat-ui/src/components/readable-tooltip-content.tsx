import { TooltipContent } from '@rahat-ui/shadcn/components/tooltip';
import { cn } from '@rahat-ui/shadcn/src';
import { ComponentProps } from 'react';

export function ReadableTooltipContent({
  className,
  ...props
}: ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        'max-w-[min(24rem,calc(100vw-2rem))] max-h-[min(20rem,calc(100vh-2rem))] overflow-y-auto whitespace-pre-wrap [overflow-wrap:anywhere]',
        className,
      )}
      {...props}
    />
  );
}
