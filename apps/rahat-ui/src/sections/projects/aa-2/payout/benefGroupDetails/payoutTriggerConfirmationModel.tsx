'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PayoutTransaction } from 'apps/rahat-ui/src/types/payout';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useState } from 'react';
import { UUID } from 'crypto';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { Can } from 'apps/rahat-ui/src/components/can';
import OtpConfirmDialog from './otpConfirmDialog';

type IProps = {
  payoutData: PayoutTransaction;
  onConfirm: (otp: string) => Promise<unknown>;
  projectId: UUID;
};

export default function PayoutConfirmationDialog({
  payoutData,
  onConfirm,
  projectId,
}: IProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const [open, setOpen] = useState(false);
  // ponytail: local latch so the button goes away immediately, even if the
  // refetched payout has not flipped isPayoutTriggered yet.
  const [triggered, setTriggered] = useState(false);

  const handleConfirm = async (otp: string) => {
    await onConfirm(otp);
    setTriggered(true);
  };

  return (
    <>
      <Can action={ACTIONS.ACTIVATE} subject={SUBJECTS.PAYOUT}>
        {payoutData?.type === 'FSP' &&
          (payoutData?.extras?.paymentProviderName === 'NCHL' ||
            payoutData?.extras?.paymentProviderName === 'Namaste Pay') && (
            <TooltipWrapper tip={tv('PAYOUT_CANNOT_BE_TRIGGERED')}>
              <Button
                className={`bg-blue-600 hover:bg-blue-700 text-white ${
                  (!!payoutData?.isPayoutTriggered || triggered) && 'hidden'
                }`}
                disabled={
                  !payoutData?.beneficiaryGroupToken?.isDisbursed ||
                  triggered ||
                  payoutData?.status === 'COMPLETED'
                }
                onClick={() => setOpen(true)}
              >
                {tv('TRIGGER_PAYOUT')}
              </Button>
            </TooltipWrapper>
          )}
      </Can>
      <OtpConfirmDialog
        projectId={projectId}
        open={open}
        onOpenChange={setOpen}
        title={tv('TRIGGER_PAYOUT')}
        description={tv('TRIGGER_PAYOUT_CONFIRMATION')}
        summary={
          <>
            <div className="flex justify-between">
              <span className="font-medium">{tv('PAYOUT_TYPE')}</span>
              <span>{translateValue(tg, payoutData?.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{tv('PAYOUT_METHOD')}</span>
              <span>
                {translateValue(
                  tg,
                  payoutData?.type === 'FSP'
                    ? payoutData?.extras?.paymentProviderName
                    : payoutData?.mode,
                  { fallbackStyle: 'raw' },
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{tv('BENEFICIARY_GROUP')}</span>
              <span>
                {payoutData?.beneficiaryGroupToken?.beneficiaryGroup?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{tg('TOTAL_BENEFICIARIES')}</span>
              <span>
                {formatNum(
                  payoutData?.beneficiaryGroupToken?.beneficiaryGroup?._count
                    ?.beneficiaries ?? 0,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{tv('TOTAL_TOKENS')}</span>
              <span>
                {formatNum(
                  payoutData?.beneficiaryGroupToken?.numberOfTokens ?? 0,
                )}
              </span>
            </div>
          </>
        }
        confirmLabel={tg('CONFIRM')}
        confirmingLabel={tv('TRIGGERING')}
        onConfirm={handleConfirm}
      />
    </>
  );
}
