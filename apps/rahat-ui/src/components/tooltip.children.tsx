import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { ReactNode } from 'react';

interface TooltipChildrenProps {
  tip: string;
  children: ReactNode;
  disable?: boolean;
}

export default function TooltipChildren({
  tip,
  children,
  disable = false,
}: TooltipChildrenProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild disabled={disable}>
          <div>{children}</div>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary" side="top">
          <p className="text-xs font-medium">{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
