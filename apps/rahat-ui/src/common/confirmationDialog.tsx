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
import { Loader2 } from 'lucide-react';

type ConfirmationDialogProps = {
  isConfirmationDialogOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  dialogTitle?: string;
  dialogMessage?: string;
  children?: React.ReactNode;
  isDestructive?: boolean;
  isPending?: boolean;
  confirmLabel?: string;
};
const ConfirmationDialog = ({
  isConfirmationDialogOpen,
  onCancel,
  onConfirm,
  dialogTitle,
  dialogMessage,
  children,
  isDestructive,
  isPending,
  confirmLabel,
}: ConfirmationDialogProps) => {
  const t = useTranslations('CONFIRMATION_ALERT_DIALOGS');
  const tg = useTranslations('GLOBAL');

  return (
    <Dialog
      open={isConfirmationDialogOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) onCancel();
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
              disabled={isPending}
              className="w-full rounded-sm"
              variant="outline"
            >
              {tg('CANCEL')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isPending}
            className="w-full rounded-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmLabel ?? t('CONFIRM_ACTION')}
              </>
            ) : (
              confirmLabel ?? t('CONFIRM_ACTION')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
