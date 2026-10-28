'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { Radio, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

type CommunicationsStatsCardsProps = {
  total: number;
  delivered: number;
  failed: number;
  isLoading?: boolean;
};

export function CommunicationsStatsCards({
  total,
  delivered,
  failed,
  isLoading = false,
}: CommunicationsStatsCardsProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const rate = total > 0 ? Math.round((delivered / total) * 100) : 0;
  
  const stats = [
    {
      title: t("TOTAL_COMMUNICATIONS") || t("TOTAL_BROADCASTS") || 'Total Communications',
      number: formatDigits(total),
      subtitle: `${formatDigits(delivered)} ${t("COMPLETED")?.toLowerCase() || 'completed'} · ${formatDigits(failed)} ${t("FAILED")?.toLowerCase() || 'failed'}`,
      Icon: Radio,
    },
    {
      title: t("DELIVERY_RATE"),
      number: `${formatDigits(rate)}%`,
      subtitle: `${formatDigits(delivered)} ${t("OF")} ${formatDigits(total)} ${t("COMPLETED")?.toLowerCase() || 'completed'}`,
      Icon: CheckCircle2,
    },
    {
      title: t("FAILED_BOUNCED"),
      number: formatDigits(failed),
      subtitle: `${formatDigits(total > 0 ? Math.round((failed / total) * 100) : 0)}% ${t("FAILURE_RATE")}`,
      Icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.Icon;
        return (
          <div key={idx} className="bg-card border rounded-sm px-3.5 py-3 flex flex-col gap-2.5 shadow-sm">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-white truncate">{stat.title}</h3>
                {isLoading ? (
                  <Skeleton className="h-3.5 w-32 mt-1 rounded" />
                ) : (
                  <p className="text-xs text-muted-foreground truncate">{stat.subtitle}</p>
                )}
              </div>
              <div className="bg-secondary rounded-full h-8 w-8 flex items-center justify-center text-primary shrink-0">
                <Icon size={16} strokeWidth={2} />
              </div>
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-7 w-20 rounded" />
              ) : (
                <div className="text-2xl font-bold text-primary">{stat.number}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
