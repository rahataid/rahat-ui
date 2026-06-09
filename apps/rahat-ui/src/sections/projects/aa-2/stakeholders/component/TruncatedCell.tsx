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
    return <span className={cn('block truncate', className)}>{text}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('block cursor-pointer truncate', className)}>
            {displayText}
          </span>
        </TooltipTrigger>
        <TooltipContent className="rounded-sm max-w-[200px]">
          <p className="whitespace-pre-line flex wrap break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
