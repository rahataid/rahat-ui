import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

interface CopyTooltipProps {
  value: string; // text to copy
  uniqueKey: string | number; // unique row identifier
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function CopyTooltip({
  value,
  uniqueKey,
  size = 15,
  strokeWidth = 1.5,
  className = '',
}: CopyTooltipProps) {
  const [copiedKey, setCopiedKey] = useState<string | number | null>(null);
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);

    setCopiedKey(uniqueKey);
    setOpen(true);

    setTimeout(() => {
      setCopiedKey(null);
      setOpen(false);
    }, 1500);
  };

  const isCopied = copiedKey === uniqueKey;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 cursor-pointer ${className}`}
            onClick={handleCopy}
          >
            {isCopied ? (
              <CopyCheck size={size} strokeWidth={strokeWidth} />
            ) : (
              <Copy
                className="text-slate-500"
                size={size}
                strokeWidth={strokeWidth}
              />
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="rounded-sm">
          <p className="text-xs font-medium">
            {isCopied ? 'copied' : 'click to copy'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
