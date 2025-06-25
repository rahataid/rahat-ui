'use client';

import {
  useAssignBenGroupToProject,
  useProjectList,
  useRemoveBeneficiaryGroup,
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

type RemoveModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  removeModal: RemoveModalType;
};

export default function RemoveBenfGroupModal({
  removeModal,
  beneficiaryGroupDetail,
}: IProps) {
  const removeBenfGroup = useRemoveBeneficiaryGroup();
  const router = useRouter();
  const handleRemoveBenfGroup = async () => {
    try {
      await removeBenfGroup.mutateAsync(beneficiaryGroupDetail.uuid as UUID);
      router.push('/beneficiary?tab=beneficiaryGroups');
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (removeBenfGroup.isSuccess) {
      removeModal.onFalse();
      router.back();
    }
  }, [removeBenfGroup]);

  return (
    <Dialog open={removeModal.value} onOpenChange={removeModal.onToggle}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Archive Beneficiary Group</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRemoveBenfGroup}
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
