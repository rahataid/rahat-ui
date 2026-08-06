'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSwal } from 'apps/rahat-ui/src/components/swal';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/usePhoneFormat';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/numeral.utils';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Dialog,
  DialogContent,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  useConfirmDisburseGroupCashTransfer,
  useDisburseGroupCashTransfer,
  usePaymentProviders,
  usePhasePayoutStatus,
  useSendGctOtp,
} from '@rahat-ui/query';
import { useNumberFormat, useLabelDigits } from '../../../../../utils/useNumberFormat';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

const OTP_LENGTH = 4;

type PaymentProvider = { id: number | string; name: string; type: string; createdAt: string };

// ─── DisburseModal ────────────────────────────────────────────────────────────
// Shows disbursement summary, provider selection, and confirm alert.

export function DisburseModal({
  projectUUID,
  recordUuid,
  record,
  group,
  open,
  onOpenChange,
}: {
  projectUUID: UUID;
  recordUuid: string;
  record: any;
  group: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tGlobal = useTranslations('GLOBAL');
  const formatPhone = usePhoneFormat();
  const router = useRouter();
  const recordsListPath = `/projects/aa/${projectUUID}/group-cash-transfer?tab=gctManagementList`;
  const confirmDisburse = useConfirmDisburseGroupCashTransfer(projectUUID);
  const disburse = useDisburseGroupCashTransfer(projectUUID);
  const sendOtp = useSendGctOtp(projectUUID);
  const { data: currentUser } = useUserCurrentUser();
  const { data: providers, isLoading: providersLoading } = usePaymentProviders({ projectUUID });

  const [providerId, setProviderId] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const swal = useSwal();
  const formatNum = useNumberFormat();
  const formatDigits = useLabelDigits();

  const email = currentUser?.data?.email;
  const isVerifyDisabled = otp.length !== OTP_LENGTH || disburse.isPending;

  const handleSendOtp = () => {
    if (!email) return;
    sendOtp.mutate({ email });
  };

  // OTP is sent once per modal open; state resets on close.
  useEffect(() => {
    if (!open) {
      setOtp('');
      setOtpError('');
      setOtpVerified(false);
      setProviderId('');
      return;
    }
    handleSendOtp();
  }, [open, email]);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      setOtpError(`Please enter the ${OTP_LENGTH} digit pin.`);
      return;
    }
    setOtpError('');
    try {
      await disburse.mutateAsync({ uuid: recordUuid, otp });
      setOtpVerified(true);
    } catch (e: any) {
      setOtpError(e?.response?.data?.message || 'Invalid pin.');
    }
  };

  const amountFmt = `Nrs. ${formatNum(record?.amount ?? 0)}`;
  const selectedProvider = providers?.find((p: PaymentProvider) => String(p.id) === providerId);

  const summaryRows: [string, string][] = [
    [t('GROUP_NAME_COL'), group?.name || '—'],
    [t('AMOUNT_COL'), amountFmt],
    [t('PHONE_COL'), formatPhone(group?.phone) || '—'],
    [t('ACCOUNT_HOLDER_NAME'), group?.bankDetails?.accountName || '—'],
    [t('BANK_ACCOUNT_NUMBER'), group?.bankDetails?.accountNumber ? formatDigits(group.bankDetails.accountNumber) : '—'],
  ];

  const handleConfirm = () => {
    setConfirmOpen(false);
    confirmDisburse.mutate({ uuid: recordUuid, paymentProviderId: providerId });
    swal.fire({ title: t('DISBURSEMENT_INITIATED'), icon: 'success', timer: 2000, showConfirmButton: false });
    onOpenChange(false);
    router.push(recordsListPath);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0" onInteractOutside={(e) => e.preventDefault()}>
          {(disburse.isPending || sendOtp.isPending) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">
                {sendOtp.isPending
                  ? 'Sending Rahat Pin to your email…'
                  : t('PLEASE_WAIT_DISBURSEMENT_INITIATING')}
              </p>
            </div>
          )}
          <Card className="rounded-sm border-0 shadow-none">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold">{t('DISBURSEMENT_DETAILS')}</h2>
              <div className="text-base divide-y">
                {summaryRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {!otpVerified && (
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
                      disabled={!email || sendOtp.isPending || disburse.isPending}
                      onClick={handleSendOtp}
                    >
                      Resend
                    </Button>
                  </div>
                  {otpError && (
                    <p className="text-sm text-destructive mt-2">{otpError}</p>
                  )}
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
                    disabled={isVerifyDisabled}
                    onClick={handleVerify}
                  >
                    {disburse.isPending ? 'Verifying…' : 'Verify'}
                  </Button>
                </div>
              )}

              <div className={`border-t pt-4 space-y-3 ${otpVerified ? '' : 'hidden'}`}>
                <p className="text-sm font-medium">{t('SELECT_PAYMENT_PROVIDER')}</p>
                <Select value={providerId} onValueChange={setProviderId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={providersLoading ? t('LOADING') : t('SELECT_A_PROVIDER')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(providers ?? []).map((p: PaymentProvider) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  disabled={!providerId || confirmDisburse.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  {t('PROCEED')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('CONFIRM_DISBURSEMENT')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ARE_YOU_SURE_YOU_WANT_TO_DISBURSE', {
                amount: amountFmt,
                groupName: group?.name,
                provider: selectedProvider?.name ?? '—',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmDisburse.isPending}>{tGlobal('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={confirmDisburse.isPending}>
              {confirmDisburse.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('DISBURSING')}</>
              ) : (
                t('YES_DISBURSE')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── DisburseButton ───────────────────────────────────────────────────────────
// Checks payout phase activation and shows tooltip when disabled.

export function DisburseButton({
  projectUUID,
  loading,
  disabled,
  disabledReason,
  onClick,
}: {
  projectUUID: UUID;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onClick: () => void;
}) {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const { data: payoutStatus } = usePhasePayoutStatus(projectUUID);
  const canDisburse = !!payoutStatus?.isPayoutMethodPhaseActivated;
  const isDisabled = !canDisburse || loading || disabled;
  const tip = !canDisburse ? t('PHASE_NOT_TRIGGERED') : disabledReason;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="mt-1">
            <Button
              size="sm"
              disabled={isDisabled}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              onClick={onClick}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t('DISBURSING')}
            </Button>
          </span>
        </TooltipTrigger>
        {isDisabled && tip && <TooltipContent>{tip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
