'use client';

import {
  useAssignBenGroupToProject,
  useProjectList,
  useRemoveBeneficiaryGroup,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import * as React from 'react';

type ValidateModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  validateModal: ValidateModalType;
};

export default function ValidateBenefBankAccountByGroupUuid({
  validateModal,
  beneficiaryGroupDetail,
}: IProps) {
  const validateBenefGroup = useValidateBeneficaryBankAccount();
  const router = useRouter();
  const handleValidateBankAccount = async () => {
    await validateBenefGroup.mutateAsync(beneficiaryGroupDetail.uuid as UUID);
  };

  React.useEffect(() => {
    validateBenefGroup.isSuccess && validateModal.onFalse();
  }, [validateBenefGroup]);

  return (
    <Dialog open={validateModal.value} onOpenChange={validateModal.onToggle}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Validate Beneficiary Bank Account</DialogTitle>
          <DialogDescription>
            This will validate the beneficiary bank account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleValidateBankAccount}
            type="button"
            variant="default"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
