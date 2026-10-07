'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { cn } from '@rahat-ui/shadcn/src';
import { useLabelDigits } from '../utils/i18n/number';
import { useDateFormat } from '../utils/i18n/date';
import type { SystemHealthStatus } from './system-health-banner';

export interface HealthRow {
  key: string;
  name: string;
  status: SystemHealthStatus;
  lastChecked?: string;
  responseTime?: string;
  message?: unknown;
}

/** Backend sends a plain string for some failures and a serialised error object for others. */
const toMessageText = (message: unknown): string => {
  if (typeof message === 'string') return message;
  const nested = (message as { message?: unknown })?.message;
  return typeof nested === 'string' ? nested : '';
};

export const healthBadgeStyles: Record<SystemHealthStatus, string> = {
  HEALTHY: 'bg-green-50 text-green-700 border-green-300',
  UNHEALTHY: 'bg-red-50 text-red-700 border-red-300',
  NA: 'bg-gray-50 text-gray-600 border-gray-300',
};

export const toHealthRowStatus = (
  status: 'up' | 'down' | undefined,
): SystemHealthStatus =>
  status === 'up' ? 'HEALTHY' : status === 'down' ? 'UNHEALTHY' : 'NA';

export const SERVICE_LABEL_KEYS: Record<string, string> = {
  database: 'DATABASE',
  redis: 'REDIS',
  rpcUrl: 'BLOCKCHAIN_RPC',
  cloudflare: 'CLOUDFLARE_STORAGE',
  communication: 'COMMUNICATION',
  offRamp: 'OFFRAMP_SERVICE',
};

export function useHealthLabels() {
  const tg = useTranslations('GLOBAL');
  const ta = useTranslations('AA_PROJECT');

  // Unmapped keys fall back to the raw key, since t() throws on a missing message.
  const labelFor = useCallback(
    (key: string) => {
      const labelKey = SERVICE_LABEL_KEYS[key];
      return labelKey ? ta(labelKey) : key;
    },
    [ta],
  );

  const statusLabel = useCallback(
    (status: SystemHealthStatus) =>
      status === 'HEALTHY'
        ? ta('HEALTHY')
        : status === 'UNHEALTHY'
          ? ta('UNHEALTHY')
          : tg('NA'),
    [ta, tg],
  );

  return { labelFor, statusLabel };
}

/** Backend latency arrives as "123ms"; separate the value and unit so it reads "123 ms". */
const withUnitSpace = (latency: string) =>
  latency.replace(/^([\d.]+)\s*([a-zA-Z]+)$/, '$1 $2');

export function useHealthColumns(): ColumnDef<HealthRow>[] {
  const tg = useTranslations('GLOBAL');
  const ta = useTranslations('AA_PROJECT');
  const { statusLabel } = useHealthLabels();
  const formatDigits = useLabelDigits();
  const formatDate = useDateFormat();

  return [
    {
      header: tg('NAME'),
      accessorKey: 'name',
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      header: tg('STATUS'),
      accessorKey: 'status',
      cell: ({ row }) => {
        const message = toMessageText(row.original.message);
        const showError = !!message && row.original.status !== 'HEALTHY';
        return (
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-medium w-fit border',
                healthBadgeStyles[row.original.status],
              )}
            >
              {statusLabel(row.original.status)}
            </Badge>
            {showError && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 cursor-help">
                      <Info className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[360px] bg-white border shadow-lg"
                  >
                    <p className="text-xs font-mono break-words whitespace-pre-wrap text-foreground">
                      {message}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
    {
      header: ta('LAST_CHECKED'),
      accessorKey: 'lastChecked',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {formatDate(row.original.lastChecked) || '-'}
        </span>
      ),
    },
    {
      header: ta('RESPONSE_TIME'),
      accessorKey: 'responseTime',
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.responseTime
            ? formatDigits(withUnitSpace(row.original.responseTime))
            : '-'}
        </span>
      ),
    },
  ];
}

/** Derived from rows, not the backend aggregate (which only checks DB+Redis), so badge and counts always agree. */
export const deriveOverallStatus = (rows: HealthRow[]): SystemHealthStatus => {
  if (!rows.length) return 'NA';
  return rows.some((r) => r.status === 'UNHEALTHY') ? 'UNHEALTHY' : 'HEALTHY';
};

export const latestCheckedAt = (rows: HealthRow[]): string | undefined =>
  rows
    .map((r) => r.lastChecked)
    .filter(Boolean)
    .sort()
    .at(-1);
