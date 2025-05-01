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
}: IconDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>
        <Icon
          className={iconClassName}
          color={color}
          onClick={() => setOpen(true)}
          size={16}
          strokeWidth={1.5}
        />
      </DialogTrigger>
      <DialogContent
        className="!rounded-sm"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="!text-center">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-sm"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleClick}
            className={cn(confirmButtonClassName, 'w-full rounded-sm')}
            variant={variant}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
