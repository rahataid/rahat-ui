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
import { useTranslations } from 'next-intl';

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
    key: 'BANK_TRANSFER',
    value: 'BANK_TRANSFER',
  },
  {
    key: 'MOBILE_MONEY',
    value: 'MOBILE_MONEY',
  },
  {
    key: 'COMMUNICATION',
    value: 'COMMUNICATION',
  },
  {
    key: 'GENERAL',
    value: 'GENERAL',
  },
];

export default function UpdateGroupProposeModal({
  validateModal,
  beneficiaryGroupDetail,
}: IProps) {
  const t = useTranslations('Beneficiary Group Detail');
  const tg = useTranslations('GLOBAL');
  const [selectedPurpose, setSelectedPurpose] = React.useState<
    string | undefined
  >();
  const [error, setError] = React.useState<string | null>(null);

  const updateGroupPropose = useUpdateGroupPropose();

  const handleUpdateGroupPuropse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPurpose) {
      setError(t('PLEASE_SELECT_A_GROUP_PURPOSE'));
      return;
    }

    setError(null);
    const payload = {
      uuid: beneficiaryGroupDetail.uuid as UUID,
      selectedPurpose,
    };
    try {
      await updateGroupPropose.mutateAsync(payload, {
        onSuccess: () => {
          // window.location.reload();
          validateModal.onFalse();
        },
      });
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
          <DialogTitle>{t('UPDATE_GROUP_PURPOSE')}</DialogTitle>
          <DialogDescription>
            {t('SELECT_THE_GROUP_PURPOSE_BELOW_AND')}
          </DialogDescription>
        </DialogHeader>

        <div>
          <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
            <SelectTrigger>
              <SelectValue placeholder={t('SELECT_GROUP_PURPOSE')} />
            </SelectTrigger>
            <SelectContent>
              {groupProposeValues.map((item) => (
                <SelectItem
                  disabled={item.value === beneficiaryGroupDetail?.groupPurpose}
                  key={item.value}
                  value={item.value}
                >
                  {t(item.key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {tg('CANCEL')}
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpdateGroupPuropse}
            type="button"
            variant="default"
          >
            {tg('UPDATE')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
