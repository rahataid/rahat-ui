'use client';
import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useSendPayoutOtp } from '@rahat-ui/query/lib/aa/payout/payout.service';
import { resolveBackendErrorMessage } from '@rahat-ui/query/utils/i18n/backend-error';
import { useEffect, useState } from 'react';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';

const OTP_LENGTH = 4;

type IProps = {
  projectId: UUID;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  summary?: React.ReactNode;
  confirmLabel: string;
  confirmingLabel?: string;
  onConfirm: (otp: string) => Promise<unknown>;
};

export default function OtpConfirmDialog({
  projectId,
  open,
  onOpenChange,
  title,
  description,
  summary,
  confirmLabel,
  confirmingLabel,
  onConfirm,
}: IProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const tb = useTranslations();

  const { data: currentUser } = useUserCurrentUser();

  const sendPayoutOtp = useSendPayoutOtp();
  const formatDigits = useLabelDigits();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const email = currentUser?.data?.email;
  const isButtonDisabled = otp.length !== OTP_LENGTH || submitting;

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
      onOpenChange(false);
    } catch (e: any) {
      const rawMessage =
        e?.response?.data?.message || tv('INVALID_PIN_FALLBACK');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        e?.response?.data?.code,
        e?.response?.data?.params,
        ['FUND_MANAGEMENT_PAYOUT', 'GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      setOtpError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        {sendPayoutOtp.isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
              {tv('SENDING_RAHAT_PIN_TO_EMAIL')}
            </p>
          </div>
        )}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {summary && (
          <div className="bg-gray-50 rounded-sm p-4 mt-2 text-sm space-y-2">
            {summary}
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-base text-foreground">
            {tv('RAHAT_PIN_SENT_TO')}{' '}
            <span className="font-semibold">
              {email || tv('REGISTERED_EMAIL_FALLBACK')}
            </span>
            {tv('RAHAT_PIN_SENT_SUFFIX')}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Input
              placeholder={tv('DIGIT_PIN_PLACEHOLDER', {
                length: formatDigits(OTP_LENGTH),
              })}
              maxLength={OTP_LENGTH}
              inputMode="numeric"
              autoFocus
              className="h-11 text-lg"
              value={formatDigits(otp)}
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
              {tg('RESEND')}
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
            {submitting && confirmingLabel ? confirmingLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
