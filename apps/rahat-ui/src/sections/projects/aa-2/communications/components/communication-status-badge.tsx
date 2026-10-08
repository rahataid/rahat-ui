'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from '@rahat-ui/shadcn/src';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
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

// 2. Map logical statuses to their translations, default labels, and visual variants
const STATUS_CONFIG: Record<
  string,
  { labelKey: string; defaultLabel: string; variant: StatusVariant }
> = {
  // Successful States
  COMPLETED: { labelKey: 'COMPLETED', defaultLabel: 'Completed', variant: 'success' },
  DELIVERED: { labelKey: 'COMPLETED', defaultLabel: 'Completed', variant: 'success' },
  SUCCESS: { labelKey: 'COMPLETED', defaultLabel: 'Completed', variant: 'success' },
  ANSWERED: { labelKey: 'COMPLETED', defaultLabel: 'Completed', variant: 'success' },

  // Dispatched / Sent
  SENT: { labelKey: 'IN_PROGRESS', defaultLabel: 'In Progress', variant: 'processing' },

  // Active / Processing States
  PROCESSING: { labelKey: 'IN_PROGRESS', defaultLabel: 'In Progress', variant: 'processing' },
  IN_PROGRESS: { labelKey: 'IN_PROGRESS', defaultLabel: 'In Progress', variant: 'processing' },

  // Queued / Scheduled / New / Not Started
  NOT_STARTED: { labelKey: 'NOT_STARTED', defaultLabel: 'Not Started', variant: 'neutral' },
  'NOT STARTED': { labelKey: 'NOT_STARTED', defaultLabel: 'Not Started', variant: 'neutral' },
  NEW: { labelKey: 'NEW', defaultLabel: 'New', variant: 'info' },
  PENDING: { labelKey: 'PENDING', defaultLabel: 'Pending', variant: 'warning' },
  SCHEDULED: { labelKey: 'SCHEDULED', defaultLabel: 'Scheduled', variant: 'neutral' },

  // Failure States
  FAILED: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  FAIL: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  FAILURE: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  'NO ANSWER': { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  NO_ANSWER: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  BUSY: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  REJECTED: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  CONGESTION: { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },
  'NOT FOUND': { labelKey: 'FAILED', defaultLabel: 'Failed', variant: 'error' },

  // Cancelled State
  CANCELLED: { labelKey: 'CANCELLED', defaultLabel: 'Cancelled', variant: 'neutral' },
  CANCELED: { labelKey: 'CANCELLED', defaultLabel: 'Cancelled', variant: 'neutral' },
};


interface CommunicationStatusBadgeProps {
  status: CommunicationStatus;
  className?: string;
  isLoading?: boolean;
}

export const CommunicationStatusBadge = React.memo(({
  status,
  className,
  isLoading = false,
}: CommunicationStatusBadgeProps) => {
  const t = useTranslations('AA_PROJECT');
  if (isLoading) {
    return <Skeleton className={cn("h-5 w-20 rounded-md", className)} />;
  }
  const normalizedStatus = (status || '').toUpperCase();
  
  const config = STATUS_CONFIG[normalizedStatus];
  const variantStyle = STATUS_STYLES[config?.variant ?? 'default'];
  
  let label = config?.defaultLabel || (
    normalizedStatus
      ? normalizedStatus
          .toLowerCase()
          .replace(/[_-]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : ''
  );

  if (config?.labelKey) {
    try {
      const translated = t(config.labelKey as any);
      if (translated && !translated.startsWith('AA_PROJECT.')) {
        label = translated;
      }
    } catch {
      // Keep existing label fallback
    }
  }


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
