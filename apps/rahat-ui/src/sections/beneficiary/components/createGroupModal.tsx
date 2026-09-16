'use client';

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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import * as React from 'react';
import { useTranslations } from 'next-intl';

type GroupModalType = {
  value: boolean;
  onToggle: () => void;
};

type IProps = {
  selectedBeneficiaries: any;
  groupModal: GroupModalType;
  handleSubmit: (data: any) => void;
};

export default function CreateGroupModal({
  groupModal,
  handleSubmit,
  selectedBeneficiaries,
}: IProps) {
  const t = useTranslations('BENEFICIARY_GROUP_CREATE');
  const tb = useTranslations('BENEFICIARY_LIST');
  const tg = useTranslations('GLOBAL');
  const [groupName, setGroupName] = React.useState('');

  const handleCreateGroup = async (benf: any) => {
    if (!groupName.trim()) {
      return alert(t('GROUP_NAME_CANNOT_BE_EMPTY'));
    }
    handleSubmit({
      beneficiaries: benf,
      groupName,
    });
  };

  return (
    <Dialog open={groupModal.value} onOpenChange={groupModal.onToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tg('CREATE_GROUP')}</DialogTitle>
          <DialogDescription>
            {selectedBeneficiaries.length > 1
              ? tb('ENTER_GROUP_NAME_TO_BE_CREATED')
              : tb('ENTER_GROUP_NAME_TO_BE_CREATED2')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={tg('GROUP_NAME')}
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {tg('CLOSE')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                handleCreateGroup(selectedBeneficiaries);
              }}
              type="button"
              variant="ghost"
              className="text-primary"
            >
              {tg('CREATE')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
