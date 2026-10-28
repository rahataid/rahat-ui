'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BroadcastFormValues } from '../types';

type CommunicationConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  dialogTitle: string;
  confirmLabel: string;
  description: string;
  values: BroadcastFormValues;
  credits?: number;
};

const SummaryRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-3 sm:gap-4 px-3 py-2.5 min-w-0 w-full text-xs sm:text-sm">
    <span className="text-muted-foreground shrink-0 font-normal">{label}</span>
    <div className="font-medium text-right min-w-0 flex-1 break-all [overflow-wrap:anywhere] text-foreground">
      {value}
    </div>
  </div>
);

export function CommunicationConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  dialogTitle,
  confirmLabel,
  description,
  values,
  credits = 0,
}: CommunicationConfirmDialogProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();

  const beneficiaries = values.beneficiaries ?? [];
  const stakeholders = values.stakeholders ?? [];
  const totalReach = [...beneficiaries, ...stakeholders].reduce(
    (sum, g) => sum + (g.count || 0),
    0,
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) onClose();
      }}
    >
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[85vh] flex flex-col p-5 sm:p-6 rounded-md overflow-hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle className="text-base sm:text-lg font-semibold text-foreground break-words break-all [overflow-wrap:anywhere]">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground break-words pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-w-0 overflow-y-auto space-y-3 py-2 pr-1 max-h-[45vh] sm:max-h-[50vh]">
          <div className="rounded-md border bg-muted/40 divide-y text-xs sm:text-sm w-full min-w-0 overflow-hidden">
            {values.title && (
              <SummaryRow
                label={t('COMMUNICATION_TITLE')}
                value={
                  <span className="line-clamp-3 break-all [overflow-wrap:anywhere]">
                    {values.title}
                  </span>
                }
              />
            )}
            <SummaryRow
              label={t('CHANNEL') || 'Channel'}
              value={t((values.channel || 'SMS').toUpperCase())}
            />
            {values.channel === 'email' && values.subject && (
              <SummaryRow
                label={t('EMAIL_SUBJECT')}
                value={
                  <span className="line-clamp-3 break-all [overflow-wrap:anywhere]">
                    {values.subject}
                  </span>
                }
              />
            )}
            {beneficiaries.length > 0 && (
              <SummaryRow
                label={t('BENEFICIARY_GROUP')}
                value={formatDigits(beneficiaries.length)}
              />
            )}
            {stakeholders.length > 0 && (
              <SummaryRow
                label={t('STAKEHOLDER_GROUP')}
                value={formatDigits(stakeholders.length)}
              />
            )}
            {totalReach > 0 && (
              <SummaryRow
                label={t('TOTAL_RECIPIENTS') || 'Total Recipients'}
                value={formatDigits(totalReach)}
              />
            )}
            {values.channel !== 'voice' && values.message && (
              <SummaryRow
                label={t('MESSAGE_CONTENT')}
                value={
                  <span className="line-clamp-4 whitespace-pre-wrap break-all [overflow-wrap:anywhere]">
                    {values.message}
                  </span>
                }
              />
            )}
            {values.channel === 'sms' && credits > 0 && (
              <SummaryRow
                label={credits === 1 ? t('SMS_CREDIT') : t('SMS_CREDITS')}
                value={formatDigits(credits)}
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {t('CANCEL') || 'Cancel'}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
