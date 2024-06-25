'use client';

import { useAssignBenToProject, useProjectList, useRemoveBeneficiary } from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import * as React from 'react';

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
  const deleteBeneficiary = useRemoveBeneficiary();

  const removeBeneficiary = async (id: string | undefined) => {
    try {
      await deleteBeneficiary.mutateAsync({
        uuid: id as UUID,
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
          <DialogTitle>Delete Beneficiary</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => removeBeneficiary(beneficiaryDetail?.uuid)}
            type="button"
            variant="ghost"
            className="text-primary"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
