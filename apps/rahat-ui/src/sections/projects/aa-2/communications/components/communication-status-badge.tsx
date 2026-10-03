'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from '@rahat-ui/shadcn/src';
import { CommunicationStatus } from '../utils/communications.utils';

export type { CommunicationStatus };

// 1. Group visual styles into standard variant categories
const STATUS_STYLES = {
  success: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  info: 'bg-sky-100 text-sky-800 hover:bg-sky-100 border-sky-200',
  processing: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200',
  warning: 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',
  error: 'bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200',
  neutral: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200',
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200',
} as const;

type StatusVariant = keyof typeof STATUS_STYLES;

// 2. Map logical statuses to their translations and visual variants
const STATUS_CONFIG: Record<string, { labelKey: string; variant: StatusVariant }> = {
  // Successful States
  DELIVERED: { labelKey: 'DELIVERED', variant: 'success' },
  SUCCESS: { labelKey: 'DELIVERED', variant: 'success' },
  ANSWERED: { labelKey: 'ANSWERED', variant: 'success' },
  COMPLETED: { labelKey: 'COMPLETED', variant: 'success' },

  // Dispatched / Sent
  SENT: { labelKey: 'SENT', variant: 'info' },

  // Active / Processing States
  PROCESSING: { labelKey: 'PROCESSING', variant: 'processing' },
  IN_PROGRESS: { labelKey: 'IN_PROGRESS', variant: 'processing' },

  // Queued / Scheduled
  PENDING: { labelKey: 'PENDING', variant: 'warning' },
  SCHEDULED: { labelKey: 'SCHEDULED', variant: 'neutral' },

  // Failure States
  FAILED: { labelKey: 'FAILED', variant: 'error' },
  FAIL: { labelKey: 'FAILED', variant: 'error' },
  'NO ANSWER': { labelKey: 'NO_ANSWER', variant: 'error' },
  BUSY: { labelKey: 'BUSY', variant: 'error' },
  REJECTED: { labelKey: 'REJECTED', variant: 'error' },

  // Cancelled State
  CANCELLED: { labelKey: 'CANCELLED', variant: 'neutral' },
};

interface CommunicationStatusBadgeProps {
  status: CommunicationStatus;
  className?: string;
}

export const CommunicationStatusBadge = React.memo(({
  status,
  className,
}: CommunicationStatusBadgeProps) => {
  const t = useTranslations('AA_PROJECT');
  const normalizedStatus = (status || '').toUpperCase();
  
  const config = STATUS_CONFIG[normalizedStatus];
  const variantStyle = STATUS_STYLES[config?.variant ?? 'default'];
  
  const label = config?.labelKey 
    ? t(config.labelKey as any) 
    : normalizedStatus || t('PENDING');

  return (
    <Badge 
      className={cn(
        "text-[11px] font-medium border",
        variantStyle,
        className
      )}
    >
      {label}
    </Badge>
  );
});

CommunicationStatusBadge.displayName = 'CommunicationStatusBadge';
