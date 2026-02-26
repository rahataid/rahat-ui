import { cn } from '@rahat-ui/shadcn/src';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

interface TruncatedCellProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedCell({
  text,
  maxLength = 20,
  className = '',
}: TruncatedCellProps) {
  if (!text) return null;

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

  // 🔹 No tooltip if truncation not needed
  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('cursor-pointer truncate', className)}>
            {displayText}
          </span>
        </TooltipTrigger>
        <TooltipContent className={cn('rounded-sm', className)}>
          <p className=" break-words ">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
