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
import { useTranslations } from 'next-intl';

type ConfirmationDialogProps = {
  isConfirmationDialogOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  dialogTitle?: string;
  dialogMessage?: string;
  children?: React.ReactNode;
};
const ConfirmationDialog = ({
  isConfirmationDialogOpen,
  onCancel,
  onConfirm,
  dialogTitle,
  dialogMessage,
  children,
}: ConfirmationDialogProps) => {
  const t = useTranslations('CONFIRMATION_ALERT_DIALOGS');
  const tg = useTranslations('GLOBAL');

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
          <DialogTitle>{dialogTitle || t('CONFIRM_ACTION')}</DialogTitle>
          <DialogDescription>{children || dialogMessage || t('THIS_ACTION_CANNOT_BE_UNDONE_ARE')}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={onCancel}
              className="w-full rounded-sm"
              variant="outline"
            >
              {tg('CANCEL')}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={onConfirm}
            className="w-full rounded-sm"
          >
            {t('CONFIRM_ACTION')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
