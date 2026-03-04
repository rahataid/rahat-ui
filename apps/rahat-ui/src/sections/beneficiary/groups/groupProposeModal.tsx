'use client';

import { useUpdateGroupPropose } from '@rahat-ui/query';
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
import * as React from 'react';

type ValidateModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

interface IListBeneficiaryGroup extends ListBeneficiaryGroup {
  groupPurpose: string;
}

type IProps = {
  beneficiaryGroupDetail: IListBeneficiaryGroup;
  validateModal: ValidateModalType;
};

const groupProposeValues = [
  {
    name: 'Bank Transfer',
    value: 'BANK_TRANSFER',
  },
  {
    name: 'Mobile Money',
    value: 'MOBILE_MONEY',
  },
  {
    name: 'Communication',
    value: 'COMMUNICATION',
  },
];

export default function UpdateGroupProposeModal({
  validateModal,
  beneficiaryGroupDetail,
}: IProps) {
  const [selectedPurpose, setSelectedPurpose] = React.useState<
    string | undefined
  >();
  const [error, setError] = React.useState<string | null>(null);

  const updateGroupPropose = useUpdateGroupPropose();

  const handleUpdateGroupPuropse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPurpose) {
      setError('Please select a group purpose.');
      return;
    }

    setError(null);
    const payload = {
      uuid: beneficiaryGroupDetail.uuid as UUID,
      selectedPurpose,
    };
    try {
      await updateGroupPropose.mutateAsync(payload);
      validateModal.onFalse();
    } catch (err) {
      console.log('Error', err);
    }
  };

  React.useEffect(() => {
    setSelectedPurpose(beneficiaryGroupDetail?.groupPurpose ?? undefined);
  }, [beneficiaryGroupDetail?.groupPurpose]);

  return (
    <Dialog open={validateModal.value} onOpenChange={validateModal.onToggle}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Update Group Purpose</DialogTitle>
          <DialogDescription>
            Select the group purpose below and click update to save.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
            <SelectTrigger>
              <SelectValue placeholder="Select group purpose" />
            </SelectTrigger>
            <SelectContent>
              {groupProposeValues.map((item) => (
                <SelectItem
                  disabled={item.value === beneficiaryGroupDetail?.groupPurpose}
                  key={item.value}
                  value={item.value}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpdateGroupPuropse}
            type="button"
            variant="default"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
