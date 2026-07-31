'use client';

import {
  useValidateBeneficaryBankAccount,
} from '@rahat-ui/query';
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
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import { UUID } from 'crypto';
import * as React from 'react';
import { useTranslations } from 'next-intl';

type ValidateModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  validateModal: ValidateModalType;
  onConfirm?: () => void;
};

export default function ValidateBenefBankAccountByGroupUuid({
  validateModal,
  beneficiaryGroupDetail,
  onConfirm,
}: IProps) {
  const t = useTranslations('BENEFICIARY_GROUP_DETAIL');
  const tg = useTranslations('GLOBAL');
  const validateBenefGroup = useValidateBeneficaryBankAccount();
  const handleValidateBankAccount = async () => {
    onConfirm?.();
    await validateBenefGroup.mutateAsync({
      uuid: beneficiaryGroupDetail.uuid as UUID,
      successMessage: tg('ACCOUNTS_CHECK_IN_PROGRESS'),
      errorMessage: tg('ERROR_WHILE_VALIDATING_BENEFICIARY'),
    });
  };

  React.useEffect(() => {
    if (validateBenefGroup.isSuccess) validateModal.onFalse();
  }, [validateBenefGroup.isSuccess]);

  return (
    <Dialog open={validateModal.value} onOpenChange={validateModal.onToggle}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {beneficiaryGroupDetail?.groupPurpose === 'MOBILE_MONEY'
              ? t('VALIDATE_BENEFICIARY_PHONE_NUMBER')
              : t('VALIDATE_BENEFICIARY_BANK_ACCOUNT')}
          </DialogTitle>
          <DialogDescription>
            {beneficiaryGroupDetail?.groupPurpose === 'MOBILE_MONEY'
              ? t('THIS_WILL_VALIDATE_THE_BENEFICIARY_PHONE')
              : t('THIS_WILL_VALIDATE_THE_BENEFICIARY_BANK')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tg('CANCEL')}
            </Button>
          </DialogClose>
          <Button
            onClick={handleValidateBankAccount}
            type="button"
            variant="default"
          >
            {tg('CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
