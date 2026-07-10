'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

interface GctActionBtnProps {
  label: string;
  icon: React.ReactNode;
  hoverClass: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function GctActionBtn({
  label,
  icon,
  hoverClass,
  onClick,
  disabled = false,
}: GctActionBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`p-1.5 rounded transition-colors ${
            disabled
              ? 'opacity-35 cursor-not-allowed text-muted-foreground'
              : hoverClass
          }`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
