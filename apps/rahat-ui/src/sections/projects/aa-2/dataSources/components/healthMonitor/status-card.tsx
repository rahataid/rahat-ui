'use client';
import { SourceHealthData } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';

import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { formatDurationFromMinutes } from 'apps/rahat-ui/src/utils/formatDurationFromMinutes';
import {
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TriangleAlert,
  X,
  CopyCheck,
  Copy,
  Hourglass,
} from 'lucide-react';
import { getDynamicColors, getSeverityFromData } from './utils/getDynamicColor';

interface ApiStatusCardProps {
  data: SourceHealthData;
  className?: string;
}

export function StatusCard({ data, className }: ApiStatusCardProps) {
  const t = useTranslations('AA_PROJECT');
  const severity = getSeverityFromData(data.currentStatus, data.errors);
  const formatDate = useDateFormat();
  const formatNum = useNumberFormat();
  const { clickToCopy, copyAction } = useCopy();

  return (
    <Card
      className={cn(
        'p-4 bg-card border-border hover:border-border/60 transition-colors rounded-sm',
        className,
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-card-foreground text-balance leading-tight">
              {data.name}
            </h3>
            <div className="flex">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p className="text-sm text-primary  transition-colors truncate mt-1 w-40 hover:cursor-pointer">
                    {data.sourceUrl}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-auto rounded-sm m-1 p-1.5"
                  align="start"
                >
                  <div className="flex justify-between gap-4 rounded-sm">
                    <p className="text-sm">{data.sourceUrl}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <button
                onClick={() => clickToCopy(data.sourceUrl, data.sourceUrl)}
                className="ml-2 text-sm text-gray-500"
              >
                {copyAction === data.sourceUrl ? (
                  <CopyCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              variant="outline"
              className={cn('text-xs font-medium', getDynamicColors(severity))}
            >
              {t(severity)}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-medium',
                getDynamicColors(data.currentStatus),
              )}
            >
              {data.currentStatus === 'HEALTHY' ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <X className="w-3 h-3 mr-1" />
              )}
              {t(data.currentStatus)}
            </Badge>
          </div>
        </div>
        {/* fetch_frequency_minutes */}
        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <Clock className="w-4 h-4" />
              <span>{t('LAST_CHECKED')}</span>
            </div>
            <span className="text-sm text-card-foreground font-mono">
              {formatDate(data.last_checked) ?? '-'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <Hourglass className="w-4 h-4" />
              <span>{t('FETCH_INTERVAL')}</span>
            </div>
            <span className="text-sm text-card-foreground font-mono">
              {formatDurationFromMinutes(data?.fetch_frequency_minutes, t, formatNum)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <Zap className="w-4 h-4" />
              <span>{t('RESPONSE_TIME')}</span>
            </div>
            <span className="text-sm text-card-foreground font-mono">
              {data.response_time_ms ? `${formatNum(data.response_time_ms)}ms` : '-'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-metric-text">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('DATA_VALIDITY')}</span>
            </div>

            <Badge
              variant="outline"
              className={cn(
                'text-xs font-medium',
                getDynamicColors(data.validity),
              )}
            >
              {data.validity ? t(data.validity) : '-'}
            </Badge>
          </div>
        </div>
      </div>

      {data?.errors && data?.errors?.length > 0 && (
        <div className=" border p-4 mt-4 rounded-sm bg-red-50 border-red-500 text-red-500">
          <div className="flex flex-row">
            <TriangleAlert />
            <div className="flex flex-col w-full p-3 pt-0">
              <div className="flex flex-row items-center">
                <span className="text-sm font-medium">
                  {data?.errors[0]?.code
                    .toLowerCase()
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
                <span className="text-xs ml-auto text-right">
                  {formatDate(data?.errors[0]?.timestamp)}
                </span>
              </div>
              <span className="text-xs">{data?.errors[0]?.message}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
