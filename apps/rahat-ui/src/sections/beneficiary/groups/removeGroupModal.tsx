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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('GLOBAL');
  const handleRemoveBenfGroup = async () => {
    try {
      await removeBenfGroup.mutateAsync({
        uuid: beneficiaryGroupDetail.uuid as UUID,
        successMessage: t('BENEFICIARY_GROUP_REMOVED_SUCCESSFULLY'),
        errorMessage: t('ERROR_WHILE_REMOVING_BENEFICIARY_GROUP'),
      });
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
          <DialogTitle>{t('ARCHIVE_BENEFICIARY_GROUP')}</DialogTitle>
          <DialogDescription>
            {t('THIS_ACTION_CANNOT_BE_UNDONE')} {t('ARE_YOU_SURE')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('CANCEL')}
            </Button>
          </DialogClose>
          <Button
            onClick={handleRemoveBenfGroup}
            type="button"
            variant="default"
          >
            {t('CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
