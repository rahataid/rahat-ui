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
  truncateByWidth?: boolean;
  className?: string;
}

export function TruncatedCell({
  text,
  maxLength = 20,
  truncateByWidth = false,
  className = '',
}: TruncatedCellProps) {
  if (!text) return null;

  if (truncateByWidth) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'block truncate cursor-pointer',
                className,
              )}
            >
              {text}
            </span>
          </TooltipTrigger>
          <TooltipContent className="rounded-sm max-w-[200px]">
            <p className="whitespace-pre-line flex wrap break-words text-[clamp(10px,0.9vw,14px)] font-normal leading-snug">
              {text}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

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
          <p className="whitespace-pre-line flex wrap break-words text-[clamp(10px,0.9vw,14px)] font-normal leading-snug">
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
