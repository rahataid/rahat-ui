'use client';
import { useGetVendorStats } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { UsersRound } from 'lucide-react';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';
import { DataCard } from 'apps/rahat-ui/src/common';
import { useChartNumberOptions } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

const GENDER_ORDER = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'] as const;

const genderColorsMap: Record<string, string> = {
  MALE: '#4A90E2',
  FEMALE: '#F06292',
  OTHER: '#9B59B6',
  UNKNOWN: '#F1C40F',
};

export default function VendorStats() {
  const g = useTranslations('GLOBAL');
  const { formatNum, chartOptions: chartOpts } = useChartNumberOptions();
  const { data: vendorStats, isLoading } = useGetVendorStats();

  const totalCounts = vendorStats?.data?.totalCounts ?? 0;
  const genderCounts: Record<string, number> =
    vendorStats?.data?.genderCounts ?? {};

  const genderKeys = GENDER_ORDER.filter(
    (key) => genderCounts[key] !== undefined && genderCounts[key] !== null,
  );
  const genderData = genderKeys.map((key) => ({
    label: translateValue(g, key, { fallbackStyle: 'raw' }),
    value: Number(genderCounts[key]) || 0,
  }));
  const genderColors = genderKeys.map((key) => genderColorsMap[key]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DataCard
          title="Total vendors"
          number={formatNum(totalCounts)}
          Icon={UsersRound}
          loading={isLoading}
          className="w-full rounded-sm"
        />
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[200px] sm:min-h-[300px] lg:col-span-2">
          <h1 className="text-sm font-medium">Gender distribution</h1>
          <div className="w-full flex-1 flex justify-center p-4 pt-0 items-center">
            <DynamicPieChart
              pieData={genderData}
              colors={genderColors}
              options={chartOpts}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
