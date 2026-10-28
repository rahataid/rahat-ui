'use client';

import { useRemoveBeneficiary } from '@rahat-ui/query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { UUID } from 'crypto';
import * as React from 'react';
import { useTranslations } from 'next-intl';

type DeleteModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryDetail: any;
  deleteModal: DeleteModalType;
  closeSecondPanel: VoidFunction;
};

export default function DeleteBeneficiaryModal({
  beneficiaryDetail,
  deleteModal,
  closeSecondPanel
}: IProps) {
  const t = useTranslations('BENEFICIARY_DETAIL');
  const tg = useTranslations('GLOBAL');
  const deleteBeneficiary = useRemoveBeneficiary();

  const removeBeneficiary = async (id: string | undefined) => {
    try {
      await deleteBeneficiary.mutateAsync({
        uuid: id as UUID,
        successMessage: tg('BENEFICIARY_REMOVED_SUCCESSFULLY'),
        errorMessage: tg('ERROR_WHILE_REMOVING_BENEFICIARY'),
      });
      closeSecondPanel()
    } catch (e) {
      console.error('Error::', e);
    }
  };

  React.useEffect(() => {
    deleteBeneficiary.isSuccess && deleteModal.onFalse()
  }, [deleteBeneficiary]);

  return (
    <Dialog open={deleteModal.value} onOpenChange={deleteModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('DELETE_BENEFICIARY')}</DialogTitle>
          <DialogDescription>
            {t('THIS_ACTION_CANNOT_BE_UNDONE_ARE')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {tg('CANCEL')}
            </Button>
          </DialogClose>
          <Button
            onClick={() => removeBeneficiary(beneficiaryDetail?.uuid)}
            type="button"
            variant="ghost"
            className="text-primary"
          >
            {tg('CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
