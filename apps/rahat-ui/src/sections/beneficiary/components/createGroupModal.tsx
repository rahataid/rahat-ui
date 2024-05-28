'use client';

import { useProjectList } from '@rahat-ui/query';
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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { UUID } from 'crypto';
import * as React from 'react';

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
  const [groupName, setGroupName] = React.useState('');

  const handleCreateGroup = async (benf: any) => {
    if (!groupName.trim()) {
      return alert('Group name cannot be empty.');
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
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Enter group name to be created for the{' '}
            {selectedBeneficiaries.length > 1 ? 'beneficiaries' : 'beneficiary'}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
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
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
