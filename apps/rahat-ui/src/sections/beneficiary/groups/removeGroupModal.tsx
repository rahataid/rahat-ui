'use client';

import { useAssignBenGroupToProject, useProjectList, useRemoveBeneficiaryGroup } from '@rahat-ui/query';
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

type RemoveModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  removeModal: RemoveModalType;
  closeSecondPanel: VoidFunction;
};

export default function RemoveBenfGroupModal({
  removeModal,
  beneficiaryGroupDetail,
  closeSecondPanel
}: IProps) {

  const removeBenfGroup = useRemoveBeneficiaryGroup()

  const handleRemoveBenfGroup = async () => {
    await removeBenfGroup.mutateAsync(beneficiaryGroupDetail.uuid as UUID)
    closeSecondPanel();
  };

  React.useEffect(() => {
    removeBenfGroup.isSuccess && removeModal.onFalse()
  }, [removeBenfGroup]);

  return (
    <Dialog open={removeModal.value} onOpenChange={removeModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Beneficiary Group</DialogTitle>
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
            onClick={handleRemoveBenfGroup}
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


