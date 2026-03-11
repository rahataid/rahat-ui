import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
  dialogMessage?: string;
  descriptionContent?: React.ReactNode;
};
const ConfirmationDialog = ({
  isConfirmationDialogOpen,
  onCancel,
  onConfirm,
  dialogTitle = 'Confirm Action',
  dialogMessage = 'This action cannot be undone. Are you sure you want to perform this action?',
  descriptionContent,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      open={isConfirmationDialogOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
    >
      <DialogContent
        className="!rounded-sm"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="!text-center">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {descriptionContent || dialogMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={onCancel}
              className="w-full rounded-sm"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={onConfirm}
            className="w-full rounded-sm"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
