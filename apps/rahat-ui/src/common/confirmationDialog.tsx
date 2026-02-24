import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type ConfirmationDialogProps = {
  isConfirmationDialogOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  dialogTitle?: string;
};
const ConfirmationDialog = ({
  isConfirmationDialogOpen,
  onCancel,
  onConfirm,
  dialogTitle = 'Confirm Action',
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={isConfirmationDialogOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          This action cannot be undone. Are you sure you want to perform this
          action?
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
