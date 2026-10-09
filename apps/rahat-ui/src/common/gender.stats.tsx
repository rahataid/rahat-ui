'use client';

import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DynamicPieChart from '../sections/projects/components/dynamicPieChart';
import { translateValue } from '../utils/i18n/translateValue';
import { useChartNumberOptions } from '../utils/i18n/number';
import { GENDER_ORDER, genderColorsMap } from '../utils/genderStats';
import { DataCard } from './data.card';

interface GenderStatsProps {
  totalLabel: string;
  distributionLabel: string;
  totalCount: number;
  genderCounts: Record<string, number>;
  Icon: LucideIcon;
  isLoading?: boolean;
}

export function GenderStats({
  totalLabel,
  distributionLabel,
  totalCount,
  genderCounts,
  Icon,
  isLoading = false,
}: GenderStatsProps) {
  const g = useTranslations('GLOBAL');
  const { formatNum, chartOptions } = useChartNumberOptions();
  const genderKeys = GENDER_ORDER.filter(
    (key) => genderCounts[key] !== undefined && genderCounts[key] !== null,
  );
  const genderData = genderKeys.map((key) => ({
    label: translateValue(g, key, { fallbackStyle: 'raw' }),
    value: Number(genderCounts[key]) || 0,
  }));
  const genderColors = genderKeys.map((key) => genderColorsMap[key]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <DataCard
        title={totalLabel}
        number={formatNum(totalCount)}
        Icon={Icon}
        loading={isLoading}
        className="w-full rounded-sm"
      />
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[200px] sm:min-h-[300px] lg:col-span-2">
        <h1 className="text-sm font-medium">{distributionLabel}</h1>
        <div className="w-full flex-1 flex justify-center p-4 pt-0 items-center">
          <DynamicPieChart
            pieData={genderData}
            colors={genderColors}
            options={chartOptions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
