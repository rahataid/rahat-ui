'use client';
import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

export type IconDialogProps = {
  handleClick?: () => void;
  dialogTitle: string;
  buttonText: string;
  dialogDescription: string;
  confirmButtonText: string;
  Icon: LucideIcon;
  iconClassName?: string;
  confirmButtonClassName?: string;
  color?: string;
  tip?: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
};
export function IconDialogComponent({
  handleClick,
  buttonText,
  confirmButtonText,
  dialogDescription,
  dialogTitle,
  Icon,
  iconClassName = '',
  confirmButtonClassName = '',
  variant = 'default',
  color,
  tip,
}: IconDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>
        {tip ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  className={iconClassName}
                  color={color}
                  onClick={() => setOpen(true)}
                  size={16}
                  strokeWidth={1.5}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{tip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Icon
            className={iconClassName}
            color={color}
            onClick={() => setOpen(true)}
            size={16}
            strokeWidth={1.5}
          />
        )}
      </DialogTrigger>
      <DialogContent
        className="!rounded-sm max-w-[clamp(240px,26vw,420px)] p-[clamp(10px,1.6vw,20px)] gap-[clamp(6px,1vw,12px)]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="!text-center">
          <DialogTitle className="text-[clamp(14px,1.6vw,18px)]">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-[clamp(11px,1vw,14px)]">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-sm h-[clamp(26px,2.6vw,36px)] px-[clamp(10px,1.2vw,14px)] text-[clamp(11px,0.9vw,13px)]"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleClick}
            className={cn(
              confirmButtonClassName,
              'w-full rounded-sm h-[clamp(26px,3.2vw,40px)] px-[clamp(10px,1.4vw,16px)] text-[clamp(11px,1vw,14px)]',
            )}
            variant={variant}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
