'use client';

import { CheckCircle2, X } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from '@rahat-ui/shadcn/src';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

// 'NA' means data is genuinely unavailable; loading uses the skeleton instead.
export type SystemHealthStatus = 'HEALTHY' | 'UNHEALTHY' | 'NA';

const statusStyles: Record<SystemHealthStatus, { banner: string; text: string; badge: string }> = {
  HEALTHY: { banner: 'bg-green-50 border-green-200', text: 'text-green-700', badge: 'bg-white text-green-700 border-green-300' },
  UNHEALTHY: { banner: 'bg-red-50 border-red-200', text: 'text-red-700', badge: 'bg-white text-red-700 border-red-300' },
  NA: { banner: 'bg-gray-50 border-gray-200', text: 'text-gray-600', badge: 'bg-white text-gray-600 border-gray-300' },
};

interface SystemHealthBannerProps {
  overallStatus: SystemHealthStatus;
  healthyCount: number;
  unhealthyCount: number;
  totalCount: number;
  lastUpdated?: string;
  overallLabel: string;
  healthyLabel: string;
  unhealthyLabel: string;
  lastUpdatedLabel: string;
}

export function SystemHealthBanner({
  overallStatus,
  healthyCount,
  unhealthyCount,
  totalCount,
  lastUpdated,
  overallLabel,
  healthyLabel,
  unhealthyLabel,
  lastUpdatedLabel,
}: SystemHealthBannerProps) {
  const style = statusStyles[overallStatus];
  // Counts render as Devanagari numerals on the Nepali locale.
  const formatNum = useNumberFormat();

  return (
    <div className={cn('rounded border p-4 flex items-center justify-between flex-wrap gap-2', style.banner)}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-semibold', style.text)}>{overallLabel}</span>
          <Badge variant="outline" className={cn('font-semibold', style.badge)}>
            {overallStatus}
          </Badge>
        </div>
        <span className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {formatNum(healthyCount)}/{formatNum(totalCount)} {healthyLabel}
        </span>
        <span className="flex items-center gap-1 text-xs text-red-600">
          <X className="w-3.5 h-3.5" />
          {formatNum(unhealthyCount)} {unhealthyLabel}
        </span>
      </div>
      {lastUpdated && (
        <span className="text-xs text-gray-500">
          {lastUpdatedLabel}: {lastUpdated}
        </span>
      )}
    </div>
  );
}
