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
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PayoutTransaction } from 'apps/rahat-ui/src/types/payout';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/numeral.utils';
import { useSendPayoutOtp } from '@rahat-ui/query/lib/aa/payout/payout.service';
import { useEffect, useState } from 'react';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';

const OTP_LENGTH = 4;

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

  // Store goes here
  const { data: currentUser } = useUserCurrentUser();

  // Mutations goes here
  const sendPayoutOtp = useSendPayoutOtp();

  // State goes here
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // ponytail: local latch so the button goes away immediately, even if the
  // refetched payout has not flipped isPayoutTriggered yet.
  const [triggered, setTriggered] = useState(false);

  // Variables goes here
  const email = currentUser?.data?.email;
  const isButtonDisabled = otp.length !== OTP_LENGTH || submitting;

  // Handlers goes here
  const handleSendOtp = () => {
    if (!email) return;
    sendPayoutOtp.mutate({ projectUUID: projectId, payload: { email } });
  };

  // OTP is sent once per dialog open; state resets on close.
  useEffect(() => {
    if (!open) {
      setOtp('');
      setOtpError('');
      return;
    }
    handleSendOtp();
  }, [open, email]);

  const handleConfirm = async () => {
    setOtpError('');
    setSubmitting(true);
    try {
      await onConfirm(otp);
      setTriggered(true);
      setOpen(false);
    } catch (e: any) {
      setOtpError(e?.response?.data?.message || 'Invalid pin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
                    (!!payoutData?.isPayoutTriggered || triggered) && 'hidden'
                  }`}
                  disabled={
                    !payoutData?.beneficiaryGroupToken?.isDisbursed ||
                    triggered ||
                    submitting
                  }
                >
                  {tv('TRIGGER_PAYOUT')}
                </Button>
              </AlertDialogTrigger>
            </TooltipWrapper>
          )}
      </RoleAuth>
      <AlertDialogContent className="max-w-lg">
        {sendPayoutOtp.isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Sending Rahat Pin to your email…
            </p>
          </div>
        )}
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

        <div className="border-t pt-4">
          <p className="text-base text-foreground">
            A Rahat Pin has been sent to{' '}
            <span className="font-semibold">
              {email || 'the registered email'}
            </span>
            . Please enter it below to verify and start disbursement.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Input
              placeholder={`${OTP_LENGTH} digit pin`}
              maxLength={OTP_LENGTH}
              inputMode="numeric"
              autoFocus
              className="h-11 text-lg"
              value={otp}
              onChange={(e) => {
                setOtp(toAsciiDigits(e.target.value).replace(/\D/g, ''));
                setOtpError('');
              }}
            />
            <Button
              variant="outline"
              disabled={!email || sendPayoutOtp.isPending}
              onClick={handleSendOtp}
            >
              Resend
            </Button>
          </div>
          {otpError && (
            <p className="text-sm text-destructive mt-2">{otpError}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="border border-gray- w-full"
            disabled={submitting}
          >
            {tg('CANCEL')}
          </AlertDialogCancel>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={handleConfirm}
            disabled={isButtonDisabled}
          >
            {submitting ? 'Triggering…' : tg('CONFIRM')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
