'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { DataCard } from 'apps/rahat-ui/src/common';
import { Radio, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function CommunicationsStatsCards() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const stats = [
    {
      title: t("TOTAL_BROADCASTS"),
      number: formatDigits("1,248"),
      subtitle: `+${formatDigits(12)}% ${t("FROM_LAST_WEEK")}`,
      Icon: Radio,
    },
    {
      title: t("DELIVERY_RATE"),
      number: `${formatDigits("98.4")}%`,
      subtitle: `${formatDigits("1,228")} ${t("OF")} ${formatDigits("1,248")} ${t("DELIVERED")?.toLowerCase() || 'delivered'}`,
      Icon: CheckCircle2,
    },
    {
      title: t("FAILED_BOUNCED"),
      number: formatDigits(6),
      subtitle: `${formatDigits("0.48")}% ${t("FAILURE_RATE")}`,
      Icon: AlertTriangle,
    },
  ];

  const getGridCols = (length: number) => {
    switch (length) {
      case 1: return 'lg:grid-cols-1';
      case 2: return 'lg:grid-cols-2';
      case 3: return 'lg:grid-cols-3';
      default: return 'lg:grid-cols-4';
    }
  };

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${getGridCols(stats.length)}`}>
      {stats.map((stat, idx) => (
        <DataCard
          key={idx}
          title={stat.title}
          number={stat.number}
          subtitle={stat.subtitle}
          Icon={stat.Icon}
        />
      ))}
    </div>
  );
}
