'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { TargetAggregateStatus } from '../utils/communications.utils';

export type CommunicationStatus =
  | TargetAggregateStatus
  | 'SENT'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PROCESSING'
  | string;

const STATUS_CONFIG: Record<string, { labelKey: string; className: string }> = {
  DELIVERED: {
    labelKey: 'DELIVERED',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  },
  SENT: {
    labelKey: 'DELIVERED',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  },
  COMPLETED: {
    labelKey: 'DELIVERED',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  },
  IN_PROGRESS: {
    labelKey: 'IN_PROGRESS',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  },
  PROCESSING: {
    labelKey: 'IN_PROGRESS',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  },
  PENDING: {
    labelKey: 'PENDING',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',
  },
  FAILED: {
    labelKey: 'FAILED',
    className: 'bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200',
  },
  CANCELLED: {
    labelKey: 'CANCELLED',
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200',
  },
};

const DEFAULT_CONFIG = {
  className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200',
};

interface CommunicationStatusBadgeProps {
  status: CommunicationStatus;
  className?: string;
}

export const CommunicationStatusBadge: React.FC<CommunicationStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const t = useTranslations('AA_PROJECT');
  const normalizedStatus = (status || '').toUpperCase();
  const config = STATUS_CONFIG[normalizedStatus] || {
    labelKey: normalizedStatus,
    className: DEFAULT_CONFIG.className,
  };

  const label = t(config.labelKey as never) || normalizedStatus || t('PENDING');

  return (
    <Badge className={`text-[11px] font-medium border ${config.className} ${className}`}>
      {label}
    </Badge>
  );
};
