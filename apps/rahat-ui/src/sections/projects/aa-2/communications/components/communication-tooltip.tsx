'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { cn } from '@rahat-ui/shadcn/src/utils';

interface CommunicationTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  delayDuration?: number;
  disabled?: boolean;
}

export function CommunicationTooltip({
  content,
  children,
  side = 'top',
  className,
  delayDuration = 200,
  disabled = false,
}: CommunicationTooltipProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {React.isValidElement(children) ? (
            children
          ) : (
            <span className="cursor-default">{children}</span>
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            'z-50 bg-secondary text-secondary-foreground shadow-md',
            'max-w-[280px] sm:max-w-xs px-3 py-1.5 text-xs font-medium leading-relaxed',
            'break-words [overflow-wrap:anywhere]',
            className,
          )}
        >
          {typeof content === 'string' ? (
            <p className="break-words [overflow-wrap:anywhere]">{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
