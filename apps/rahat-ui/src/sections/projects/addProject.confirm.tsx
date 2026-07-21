import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useTranslations } from 'next-intl';

type AddProjectConfirmModalProps = {
  open: boolean;
  handleClose: () => void;
};

const AddProjectConfirmModal: React.FC<AddProjectConfirmModalProps> = ({
  open,
  handleClose,
}) => {
  const t = useTranslations('Projects List');
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('ADD_PROJECT')}</DialogTitle>
          <DialogDescription>{t('CONTACT_ADMIN')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleClose()}
            >
              {t('OK')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectConfirmModal;
