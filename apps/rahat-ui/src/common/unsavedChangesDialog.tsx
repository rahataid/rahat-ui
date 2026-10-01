import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';

type IProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  // Optional third action: discard changes and continue navigating.
  // The button only renders when onDiscard is provided.
  onDiscard?: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  discardText?: string;
};

export function UnsavedChangesDialog({
  open,
  onConfirm,
  onCancel,
  onDiscard,
  title = 'Unsaved Changes',
  description = 'Are you sure you want to leave? Your entered data will be lost.',
  cancelText = 'No, stay',
  confirmText = 'Yes, leave',
  discardText = "Don't save",
}: IProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          {onDiscard && (
            <Button variant="outline" onClick={onDiscard}>
              {discardText}
            </Button>
          )}
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
