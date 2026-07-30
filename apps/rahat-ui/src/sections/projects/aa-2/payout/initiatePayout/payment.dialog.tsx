'use client';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useState } from 'react';
import { PaymentState } from './payment';

export type PaymentDialogProps = {
  handleSubmit: () => void;
  formState: PaymentState;
  shouldTriggerDialog: () => Promise<boolean>;
};
export function PaymentDialog({
  formState,
  handleSubmit,
  shouldTriggerDialog,
}: PaymentDialogProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  // State goes here
  const [open, setOpen] = useState(false);

  // Handlers goes here
  const handleDialogBox = async () => {
    const isValid = await shouldTriggerDialog();

    if (!isValid) {
      return;
    }

    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Button
        className="rounded-sm w-48"
        type="button"
        onClick={handleDialogBox}
      >
        {tg('CONFIRM')}
      </Button>
      <DialogContent
        className="!rounded-sm"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="!text-center">
          <DialogTitle>{tv('CONFIRM_PAYOUT')}</DialogTitle>
          <DialogDescription>
            {tv('CONFIRM_PAYOUT_DIALOG_DESC')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 p-6 rounded-sm bg-gray-200 border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">{tv('PAYOUT_TYPE')}</div>
            <div className="font-medium text-muted-foreground">
              {formState?.method}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">{tv('PAYOUT_METHOD')}</div>
            <div className="font-medium text-muted-foreground">
              {formState?.method === 'FSP'
                ? formState?.paymentProvider?.name
                : formState.mode.charAt(0).toUpperCase() +
                  formState.mode.slice(1).toLowerCase()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">
              {tv('BENEFICIARY_GROUP')}
            </div>
            <div className="font-medium text-muted-foreground">
              {formState?.group?.name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">{tg('TOTAL_BENEFICIARIES')}</div>
            <div className="font-medium text-muted-foreground">
              {formatNum(formState?.group?._count?.beneficiaries)}
            </div>
          </div>

          {Object.keys(formState.vendor).length !== 0 && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600 font-medium">{t('VENDOR_NAME')}</div>
                <div className="font-medium text-muted-foreground">
                  {formState?.vendor?.name}
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 font-medium">{tv('TOTAL_TOKENS')}</div>
            <div className="font-medium text-muted-foreground">
              {formatNum(formState?.group?.tokensReserved?.[0]?.numberOfTokens)}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-sm"
            variant="outline"
          >
            {tg('CANCEL')}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-sm"
          >
            {tv('PAYOUT')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
