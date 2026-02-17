import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';

interface CopyTooltipProps {
  value: string;
  uniqueKey: string | number;
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
  const { copyAction, clickToCopy } = useCopy();
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    if (!value) return;

    clickToCopy(value, uniqueKey);
    setOpen(true);
  };

  const isCopied = copyAction === uniqueKey;

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
