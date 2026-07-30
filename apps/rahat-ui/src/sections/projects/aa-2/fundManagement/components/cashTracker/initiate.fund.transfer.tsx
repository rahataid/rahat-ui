import {
  PROJECT_SETTINGS_KEYS,
  useGetBalance,
  useGetTRANSACTIONS,
  useInitateFundTransfer,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { UUID } from 'crypto';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Entities } from './cash.tracker';
import { AARoles } from '@rahat-ui/auth';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { TooltipContent } from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function InitiateFundTransfer({}: {}) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const t = useTranslations('AA_PROJECT');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    currency: 'NPR',
    comments: '',
  });
  const [error, setError] = useState('');

  const id = useParams().id as UUID;
  const router = useRouter();
  const initiateFundTransfer = useInitateFundTransfer(id);
  const stakeholders = useProjectSettingsStore(
    (s) => s.settings?.[id]?.[PROJECT_SETTINGS_KEYS.ENTITIES],
  );
  const contractSettings = useProjectSettingsStore(
    (s) => s.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return stakeholders?.find((e: Entities) =>
      currentUser?.data?.roles?.includes(e.alias.replace(/\s+/g, '')),
    );
  }, [currentUser, stakeholders]);
  const currentEntityAlias = currentEntity?.alias?.replace(/\s+/g, '');

  useEffect(() => {
    if (currentEntity) {
      setFormData((prev) => ({ ...prev, from: currentEntity.smartaccount }));
    }
  }, [currentEntity]);

  const { data: balance } = useGetBalance(
    id,
    currentEntity?.smartaccount || '',
  );
  const { data: transactions } = useGetTRANSACTIONS(id);

  //get current entity pending transfer
  const pendingTransfers = useMemo(() => {
    if (
      !transactions?.data?.entityOutcomes ||
      !currentEntityAlias ||
      currentEntityAlias !== AARoles.UNICEFNepalCO
    ) {
      return 0;
    }

    const entity = transactions.data.entityOutcomes[1];
    // Calculate total pending amount
    const totalPendingAmount = entity.pending.reduce(
      (sum: number, item: any) => sum + Number(item.amount || 0),
      0,
    );
    return totalPendingAmount;
  }, [transactions]);

  const remainingBalance = Number(balance?.data?.formatted || 0);
  const formatNum = useNumberFormat();
  // Check if a recipient should be disabled based on sender restrictions
  const isRecipientDisabled = (recipient: Entities): boolean => {
    // Don't allow sending to self
    if (recipient.smartaccount === formData.from) {
      return true;
    }

    if (!formData.from || !stakeholders) return false;

    // Find indices of sender and recipient
    const senderIndex = stakeholders.findIndex(
      (s: Entities) => s.smartaccount === formData.from,
    );
    const recipientIndex = stakeholders.findIndex(
      (s: Entities) => s.smartaccount === recipient.smartaccount,
    );

    if (senderIndex === -1 || recipientIndex === -1) return false;

    // Find Municipality and Beneficiary indices (if they exist)
    const municipalityIndex = stakeholders.findIndex((s: Entities) =>
      s.alias?.toLowerCase().includes('municipality'),
    );
    const beneficiaryIndex = stakeholders.findIndex((s: Entities) =>
      s.alias?.toLowerCase().includes('beneficiary'),
    );

    // First entity (index 0) can only send to second entity (index 1) or Municipality
    if (senderIndex === 0) {
      // Disable if recipient is first entity (itself) or Beneficiary
      if (recipientIndex === 0 || recipientIndex === beneficiaryIndex) {
        return true;
      }
      // Allow if recipient is second entity (index 1) or Municipality
      // Disable everything else
      return recipientIndex !== 1 && recipientIndex !== municipalityIndex;
    }

    // Municipality can only send to Beneficiary or third entity (index 2)
    if (municipalityIndex !== -1 && senderIndex === municipalityIndex) {
      // Disable if recipient is Municipality (itself) or first entity (index 0)
      if (recipientIndex === municipalityIndex || recipientIndex === 0) {
        return true;
      }
      // Allow if recipient is Beneficiary or third entity (index 2)
      // Disable everything else
      return recipientIndex !== 2 && recipientIndex !== beneficiaryIndex;
    }

    // For other entities, use default behavior (only disable self)
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await initiateFundTransfer.mutateAsync({
      payload: {
        from: formData.from,
        to: formData.to,
        amount: formData.amount,
        description: formData.comments,
        alias:
          stakeholders.find((s: Entities) => s.smartaccount === formData.from)
            ?.alias || 'UNKNOWN',
      },
    });

    setFormData({
      from: '',
      to: '',
      amount: '',
      currency: 'NPR',
      comments: '',
    });
    router.push(`/projects/aa/${id}/fund-management?tab=cashTracker`);
  };
  const toAlias =
    stakeholders?.find((s: Entities) => s.smartaccount === formData.to)
      ?.alias || 'Municipility';

  const handleClear = async () => {
    setFormData({
      from: currentEntity?.smartaccount || '',
      to: '',
      amount: '',
      currency: 'NPR',
      comments: '',
    });
    setError('');
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          className="text-sm text-gray-500 mb-2"
          onClick={() => router.back()}
        >
          &larr; {tv('BACK_BTN')}
        </button>
        <h1 className="text-2xl font-bold">{tv('INITIATE_FUND_TRANSFER')}</h1>
        <p className="text-sm text-gray-500">
          {tv('FILL_THE_FORM_BELOW_TO_INITIATE')}
        </p>
      </div>

      {/* Budget & Balance */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">{tv('PROJECT_BUDGET')}</p>
          <p className="text-xl text-blue-500 font-bold">
            {formatNum(remainingBalance + Number(balance?.data?.sent ?? 0))}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">{tv('REMAINING_BALANCE')}</p>
          <p className="text-xl text-blue-500 font-bold">
            {formatNum(remainingBalance ?? 0)}
          </p>
        </div>
        {currentEntityAlias === AARoles.UNICEFNepalCO && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex">
              <p className="text-sm text-gray-500">{tv('PENDING_BALANCE')}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={16}
                      className="text-muted-foreground cursor-help hover:text-primary transition-colors"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tv('PENDING_TRANSFER_TO', { toAlias })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xl text-blue-500 font-bold">
              {pendingTransfers || 0}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From & To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{tv('FROM_LABEL')}</Label>
            <Select value={formData.from} disabled>
              <SelectTrigger>
                <SelectValue placeholder={tv('SELECT_SENDER')} />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.map((s: Entities) => (
                  <SelectItem key={s.address} value={s.smartaccount}>
                    {s.alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{tv('TO_LABEL')}</Label>
            <Select
              value={formData.to}
              onValueChange={(value) => setFormData({ ...formData, to: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={tv('SELECT_RECIPIENT')} />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.map((s: Entities) => (
                  <SelectItem
                    key={s.address}
                    value={s.smartaccount}
                    disabled={isRecipientDisabled(s)}
                  >
                    {s.alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <Label>{tv('AMOUNT_LABEL')}</Label>
          <div className="flex gap-2">
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NPR">{t('CURRENCY_NPR')}</SelectItem>
                <SelectItem value="USD">{t('CURRENCY_USD')}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-1">
              <Input
                type="number"
                placeholder={tv('ENTER_AMOUNT')}
                value={formData.amount}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (e.target.value === '') {
                    setFormData({ ...formData, amount: '' });
                    setError('');
                    return;
                  }

                  if (value <= 0) {
                    setError(t('AMOUNT_MUST_BE_GREATER_THAN_0'));
                    return;
                  }

                  const exceedsBalance =
                    value > remainingBalance ||
                    (currentEntityAlias === AARoles.UNICEFNepalCO &&
                      value + pendingTransfers > remainingBalance);
                  if (exceedsBalance) {
                    setError(t('AMOUNT_EXCEEDS_REMAINING_BALANCE'));
                    return;
                  }

                  setError('');
                  setFormData({ ...formData, amount: value.toString() });
                }}
                className="flex-1"
              />
              {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <Label>{tv('REMARKS')}</Label>
          <Textarea
            placeholder={tv('WRITE_REMARKS')}
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClear}>
            {tv('CLEAR_BTN')}
          </Button>
          <Button
            type="submit"
            disabled={
              initiateFundTransfer.isPending ||
              !formData.from ||
              !formData.to ||
              !formData.amount
            }
          >
            {initiateFundTransfer.isPending ? (
              <span>{tv('SUBMITTING')}</span>
            ) : (
              tv('SUBMIT_BTN')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
