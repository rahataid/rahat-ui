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

export type PaymentDialogProps = {
  handleClick: () => void;
  dialogTitle: string;
  buttonText: string;
  dialogDescription: string;
  confirmButtonText: string;
  buttonIcon: LucideIcon;
  buttonClassName?: string;
  confirmButtonClassName?: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
};
export function DialogComponent({
  handleClick,
  buttonText,
  confirmButtonText,
  dialogDescription,
  dialogTitle,
  buttonIcon,
  buttonClassName = '',
  confirmButtonClassName = '',
  variant = 'default',
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>
        {/* <Button className="rounded-sm" onClick={() => setOpen(true)}>
          {buttonText}
        </Button> */}
        <IconLabelBtn
          Icon={buttonIcon}
          handleClick={() => setOpen(true)}
          name={buttonText}
          variant={variant}
          className={buttonClassName}
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
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
