'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Check, EyeOff, KeyRound, Loader2 } from 'lucide-react';

export type QrOtpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (includeOtp: boolean) => void;
  isPending: boolean;
};

export function QrOtpDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: QrOtpDialogProps) {
  const t = useTranslations('AA_PROJECT');

  const [qrOtpChoice, setQrOtpChoice] = useState(true);

  useEffect(() => {
    if (open) setQrOtpChoice(true);
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('QR_OTP_MODAL_TITLE')}</DialogTitle>
          <DialogDescription>{t('QR_OTP_MODAL_DESCRIPTION')}</DialogDescription>
        </DialogHeader>
        <div
          role="radiogroup"
          aria-label={t('QR_OTP_MODAL_TITLE')}
          className="flex flex-col gap-3 py-2"
        >
          <button
            type="button"
            role="radio"
            aria-checked={qrOtpChoice}
            disabled={isPending}
            onClick={() => setQrOtpChoice(true)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
              qrOtpChoice
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                qrOtpChoice
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <KeyRound size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">
                {t('GENERATE_RAHAT_PIN')}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {t('QR_INCLUDE_PIN_HINT')}
              </span>
            </span>
            {qrOtpChoice && (
              <Check size={18} className="mt-1 shrink-0 text-primary" />
            )}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={!qrOtpChoice}
            disabled={isPending}
            onClick={() => setQrOtpChoice(false)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
              !qrOtpChoice
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                !qrOtpChoice
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <EyeOff size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">
                {t('EXCLUDE_RAHAT_PIN')}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {t('QR_EXCLUDE_PIN_HINT')}
              </span>
            </span>
            {!qrOtpChoice && (
              <Check size={18} className="mt-1 shrink-0 text-primary" />
            )}
          </button>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="cursor-pointer"
          >
            {t('CANCEL')}
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(qrOtpChoice)}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending && <Loader2 size={16} className="mr-2 animate-spin" />}
            {isPending ? t('GENERATING') : t('GENERATE_QR')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
