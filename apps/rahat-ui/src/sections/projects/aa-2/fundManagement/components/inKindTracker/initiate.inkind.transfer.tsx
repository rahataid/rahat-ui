import {
  PROJECT_SETTINGS_KEYS,
  useGetInkindBalance,
  useInitateInkindTransfer,
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
import { Entities } from './types';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function InitiateInKindTransfer({}: {}) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const formatNum = useNumberFormat();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    currency: 'USD',
    comments: '',
  });

  const id = useParams().id as UUID;
  const router = useRouter();
  const initiateInKindTransfer = useInitateInkindTransfer(id);
  const stakeholders = useProjectSettingsStore(
    (s) => s.settings?.[id]?.[PROJECT_SETTINGS_KEYS.INKIND_ENTITIES],
  );

  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return stakeholders?.find((e: Entities) =>
      currentUser?.data?.roles?.includes(e.alias.replace(/\s+/g, '')),
    );
  }, [currentUser, stakeholders]);

  useEffect(() => {
    if (currentEntity) {
      setFormData((prev) => ({ ...prev, from: currentEntity.smartaccount }));
    }
  }, [currentEntity]);

  const donar = useMemo(() => {
    return stakeholders?.find((e: Entities) => e.alias === 'UNICEF Nepal CO');
  }, [currentUser, stakeholders]);

  const { data: balance } = useGetInkindBalance(id, donar?.smartaccount || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateInKindTransfer.mutateAsync({
      payload: {
        from: formData.from,
        to: formData.to,
        alias: formData.currency,
        amount: formData.amount,
        description: formData.comments,
      },
    });
    setFormData({
      from: '',
      to: '',
      amount: '',
      currency: 'USD',
      comments: '',
    });
    router.push(`/projects/aa/${id}/fund-management?tab=inKindTracker`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          className="text-sm text-gray-500 mb-2"
          onClick={() => router.back()}
        >
          &larr; {t('BACK')}
        </button>
        <h1 className="text-2xl font-bold">{tg('INITIATE_IN_KIND_TRANSFER')}</h1>
        <p className="text-sm text-gray-500">
          {tg('FILL_THE_FORM_BELOW_TO_INITIATE')}
        </p>
      </div>

      {/* Budget & Balance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">{tg('TOTAL_STOCK')}</p>
          <p className="text-xl text-blue-500 font-bold">
            {formatNum(Number(balance?.data?.formatted) + Number(balance?.data?.sent) || 0)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">{tg('REMAINING_STOCK')}</p>
          <p className="text-xl text-blue-500 font-bold">
            {formatNum(balance?.data?.formatted || 0)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From & To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{t('FROM')}</Label>
            <Select value={formData.from} disabled>
              <SelectTrigger>
                <SelectValue placeholder={t('SELECT_SENDER')} />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.map((s) => (
                  <SelectItem key={s.address} value={s.smartaccount}>
                    {s.alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('TO')}</Label>
            <Select
              value={formData.to}
              onValueChange={(value) => setFormData({ ...formData, to: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('SELECT_RECIPIENT')} />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.map((s) => (
                  <SelectItem
                    key={s.address}
                    value={s.smartaccount}
                    disabled={s.smartaccount === formData.from}
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
          <Label>{t('AMOUNT')}</Label>
          <div className="flex gap-2">
            <Select
              defaultValue="Hygiene Kits"
              // value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-34">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked={true} value="Hygiene Kits">
                  {tg('HYGIENE_KITS')}
                </SelectItem>
                <SelectItem value="Food Packages">{tg('FOOD_PACKAGES')}</SelectItem>
                <SelectItem value="Water Packages">{tg('WATER_PACKAGES')}</SelectItem>
                <SelectItem value="Other">{t('OTHER')}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={tg('ENTER_NUMBER')}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <Label>{t('REMARKS')}</Label>
          <Textarea
            placeholder={t('WRITE_REMARKS')}
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            {t('CLEAR')}
          </Button>
          <Button
            type="submit"
            disabled={
              initiateInKindTransfer.isPending ||
              !formData.from ||
              !formData.to ||
              !formData.amount
            }
          >
            {initiateInKindTransfer.isPending ? t('SUBMITTING') : t('CONFIRM')}
          </Button>
        </div>
      </form>
    </div>
  );
}
