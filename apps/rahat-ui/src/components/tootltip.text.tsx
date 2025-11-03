'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { ComponentPropsWithoutRef } from 'react';

type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipContent>;

type TooltipTextProps = {
  /**
   * Content to display in the tooltip trigger (the truncated text)
   */
  title: string;
  /**
   * Tooltip  text
   */
  content: string;
  /**
   * Custom className for the trigger element (wraps children)
   */
  titleClassName?: string;
  /**
   * Custom className for TooltipContent (merges with defaults)
   */
  contentClassName?: string;
  /**
   * Additional props to pass to TooltipContent (overrides defaults)
   */
  contentProps?: Omit<TooltipContentProps, 'className' | 'children'>;
  /**
   * Delay duration for TooltipProvider (optional)
   */
  delayDuration?: number;
  /**
   * Side of the Tooltip (optional)
   */
  side?: TooltipContentProps['side'];
};

/**
 * Custom tooltip component for truncated text with default styling
 * Default: side="bottom", className="w-80 rounded-sm text-justify"
 */
export function TooltipText({
  title,
  content,
  titleClassName,
  contentClassName,
  contentProps = {},
  delayDuration,
  side = 'bottom',
}: TooltipTextProps) {
  // Default classes for trigger div
  const defaultTitleClassName = 'truncate w-40 hover:cursor-pointer';

  // Default props for TooltipContent
  const defaultContentProps: Partial<TooltipContentProps> = {
    side: side,
    className: 'w-80 rounded-sm text-justify',
    ...contentProps, // User-provided props override defaults
  };

  // Merge trigger className with defaults
  const mergedTitleClassName = cn(
    defaultTitleClassName,
    titleClassName, // Custom className merges with default
  );

  // Merge  className with defaults
  const mergedContentClassName = cn(
    defaultContentProps.className,
    contentClassName, // Custom className merges with default
  );

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={mergedTitleClassName}>{title}</div>
        </TooltipTrigger>
        <TooltipContent
          {...defaultContentProps}
          className={mergedContentClassName}
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
