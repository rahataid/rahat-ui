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

type IProps = {
  payoutData: PayoutTransaction;
  onConfirm: () => void;
};

export default function PayoutConfirmationDialog({
  payoutData,
  onConfirm,
}: IProps) {
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
              tip="Payout cannot be triggered because funds have not been disbursed to the beneficiary group."
              disable={payoutData?.beneficiaryGroupToken?.isDisbursed}
            >
              <AlertDialogTrigger asChild>
                <Button
                  className={`bg-blue-600 hover:bg-blue-700 text-white ${
                    !!payoutData?.isPayoutTriggered && 'hidden'
                  }`}
                  disabled={!payoutData?.beneficiaryGroupToken?.isDisbursed}
                >
                  Trigger Payout
                </Button>
              </AlertDialogTrigger>
            </TooltipWrapper>
          )}
      </RoleAuth>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-semibold">
            Trigger Payout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to trigger this payout?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-gray-50 rounded-sm p-4 mt-2 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Payout Type</span>
            <span>{payoutData?.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payout Method</span>
            <span>
              {payoutData?.type === 'FSP'
                ? payoutData?.extras?.paymentProviderName
                : payoutData?.mode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Beneficiary Group Name</span>
            <span>
              {payoutData?.beneficiaryGroupToken?.beneficiaryGroup?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Beneficiaries</span>
            <span>
              {
                payoutData?.beneficiaryGroupToken?.beneficiaryGroup?._count
                  ?.beneficiaries
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Tokens</span>
            <span>{payoutData?.beneficiaryGroupToken?.numberOfTokens}</span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border border-gray- w-full">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={onConfirm}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
