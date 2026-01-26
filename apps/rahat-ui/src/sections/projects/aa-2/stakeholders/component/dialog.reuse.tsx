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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

export type PaymentDialogProps = {
  isLoading: boolean;
  handleClick: (groupName: string) => void;
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
  isLoading,
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
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  const handleEditClick = () => {
    if (groupName.trim() === '') {
      setError('Group name cannot be empty.');
      return;
    }

    if (groupName.length < 3) {
      setError('Group name must be at least 3 characters long.');
      return;
    }

    setError('');
    handleClick(groupName);
    setGroupName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>
        <IconLabelBtn
          Icon={buttonIcon}
          handleClick={() => setOpen(true)}
          name={buttonText}
          variant={variant}
          className={buttonClassName}
          type="button"
        />
      </DialogTrigger>
      <DialogContent
        className="!rounded-sm [&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="!text-center ">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium">Group Name</p>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-sm"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleEditClick}
            className={cn(confirmButtonClassName, 'w-full rounded-sm')}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
