import { useCreateBudget } from '@rahat-ui/query';
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

export default function Budget({}: {}) {
  const t = useTranslations('AA_PROJECT');
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'NPR',
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState('');

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
      type: 'cash-tracker',
    });

    setFormData({
      amount: '',
      currency: 'NPR',
    });
    setShowConfirmDialog(false);
    router.push(`/projects/aa/${id}/fund-management?tab=cashTracker`);
  };

  const formatAmount = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '';

    const formatted = formatNum(numAmount);

    return currency === 'NPR' ? `Rs.${formatted}` : `$${formatted}`;
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
        <h1 className="text-2xl font-bold">{t('CREATE_BUDGET')}</h1>
        <p className="text-sm text-gray-500">
          {t('FILL_THE_FORM_BELOW_TO_CREATE_BUDGET')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <Label>{t('AMOUNT')}</Label>
          <div className="flex gap-2 w-full">
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
                placeholder={t('ENTER_AMOUNT')}
                value={formData.amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value <= 0) {
                    setError(t('AMOUNT_MUST_BE_GREATER_THAN_0'));
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

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ amount: '', currency: 'NPR' })}
          >
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
            <DialogTitle className="text-center">{t('CREATE_BUDGET')}</DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 mt-2">
              {t('ARE_YOU_SURE_YOU_WANT_TO_CREATE_BUDGET')}
            </DialogDescription>
          </DialogHeader>

          {/* Budget Amount Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-gray-100 rounded-lg px-6 py-4 w-full text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(formData.amount, formData.currency)}
              </div>
              <div className="text-sm text-gray-700 mt-1">{t('BUDGET_CREATED')}</div>
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
