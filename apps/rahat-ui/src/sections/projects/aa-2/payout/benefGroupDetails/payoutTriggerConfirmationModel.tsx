import { useTranslations } from 'next-intl';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PayoutTransaction } from 'apps/rahat-ui/src/types/payout';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type IProps = {
  payoutData: PayoutTransaction;
  onConfirm: () => void;
};

export default function PayoutConfirmationDialog({
  payoutData,
  onConfirm,
}: IProps) {
  const tv = useTranslations('AA Project with Cash Tracker');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  return (
    <AlertDialog>
      <RoleAuth
        roles={[AARoles.ADMIN, AARoles.Municipality]}
        hasContent={false}
      >
        {payoutData?.type === 'FSP' &&
          (payoutData?.extras?.paymentProviderName === 'NCHL' ||
            payoutData?.extras?.paymentProviderName === 'Namaste Pay') && (
            <TooltipWrapper
              tip={tv('PAYOUT_CANNOT_BE_TRIGGERED')}
              disable={payoutData?.beneficiaryGroupToken?.isDisbursed}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className={`bg-blue-600 hover:bg-blue-700 text-white ${
                    !!payoutData?.isPayoutTriggered && 'hidden'
                  }`}
                  disabled={!payoutData?.beneficiaryGroupToken?.isDisbursed}
                >
                  {tv('TRIGGER_PAYOUT')}
                </Button>
              </AlertDialogTrigger>
            </TooltipWrapper>
          )}
      </RoleAuth>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-semibold">
            {tv('TRIGGER_PAYOUT')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {tv('TRIGGER_PAYOUT_CONFIRMATION')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-gray-50 rounded-sm p-4 mt-2 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">{tv('PAYOUT_TYPE')}</span>
            <span>{payoutData?.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{tv('PAYOUT_METHOD')}</span>
            <span>
              {payoutData?.type === 'FSP'
                ? payoutData?.extras?.paymentProviderName
                : payoutData?.mode}
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
              {formatNum(payoutData?.beneficiaryGroupToken?.numberOfTokens ?? 0)}
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border border-gray- w-full">
            {tg('CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={onConfirm}
          >
            {tg('CONFIRM')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
