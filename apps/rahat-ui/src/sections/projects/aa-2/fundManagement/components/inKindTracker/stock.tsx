import {
  PROJECT_SETTINGS_KEYS,
  useCreateBudget,
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
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function Stock({}: {}) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'Hygiene Kits',
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const id = useParams().id as UUID;
  const router = useRouter();
  const createBudget = useCreateBudget(id);
  const formatNum = useNumberFormat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    await createBudget.mutateAsync({
      amount: formData.amount.toString(),
      type: 'inkind-tracker',
    });

    setFormData({
      amount: '',
      currency: 'Hygiene Kits',
    });
    setShowConfirmDialog(false);
    router.push(`/projects/aa/${id}/fund-management?tab=cashTracker`);
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
        <h1 className="text-2xl font-bold">{tg('CREATE_STOCK')}</h1>
        <p className="text-sm text-gray-500">
          {tg('FILL_THE_FORM_BELOW_TO_CREATE')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <Label>{t('AMOUNT')}</Label>
          <div className="flex gap-2 w-full">
            <Select
              defaultValue="Hygiene Kits"
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

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            {t('CLEAR')}
          </Button>
          <Button
            type="submit"
            disabled={createBudget.isPending || !formData.amount}
          >
            {createBudget.isPending ? <span>{t('SUBMITTING')}</span> : t('CONFIRM')}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">{tg('CREATE_STOCK')}</DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 mt-2">
              {tg('CREATE_STOCK_CONFIRMATION')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-gray-100 rounded-lg px-6 py-4 w-full text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatNum(formData.amount)} {formData.currency}
              </div>
              <div className="text-sm text-gray-700 mt-1">{tg('STOCK_CREATED')}</div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => setShowConfirmDialog(false)}
            >
              {t('CANCEL')}
            </Button>
            <Button
              type="button"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirm}
              disabled={createBudget.isPending}
            >
              {createBudget.isPending ? t('CREATING') : t('CONFIRM')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
