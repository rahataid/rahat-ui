import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { ReactNode } from 'react';
import { ReadableTooltipContent } from './readable-tooltip-content';

interface TooltipWrapperProps {
  tip: string;
  children: ReactNode;
  disable?: boolean;
}

export default function TooltipWrapper({
  tip,
  children,
  disable = false,
}: TooltipWrapperProps) {
  if (disable || !tip?.trim()) {
    return <>{children}</>;
  }
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>{children}</div>
        </TooltipTrigger>
        <ReadableTooltipContent className="bg-secondary" side="top">
          <p className="text-xs font-medium">{tip}</p>
        </ReadableTooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
