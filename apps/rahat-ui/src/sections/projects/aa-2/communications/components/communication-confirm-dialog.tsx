'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
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
  <div className="flex items-start justify-between gap-4 px-3 py-2">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="font-medium text-right break-words">{value}</span>
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
    <ConfirmationDialog
      isConfirmationDialogOpen={isOpen}
      onCancel={onClose}
      onConfirm={onConfirm}
      dialogTitle={dialogTitle}
      isPending={isPending}
      confirmLabel={confirmLabel}
    >
      <div className="space-y-3 text-left">
        <p>{description}</p>
        <div className="rounded-md border bg-muted/40 divide-y text-sm">
          {values.title && (
            <SummaryRow label={t('COMMUNICATION_TITLE')} value={values.title} />
          )}
          <SummaryRow
            label={t('CHANNEL') || 'Channel'}
            value={t((values.channel || 'SMS').toUpperCase())}
          />
          {values.channel === 'email' && values.subject && (
            <SummaryRow label={t('EMAIL_SUBJECT')} value={values.subject} />
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
              value={<span className="line-clamp-2 whitespace-pre-wrap">{values.message}</span>}
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
    </ConfirmationDialog>
  );
}
