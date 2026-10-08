'use client';
import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';
import { Wrench } from 'lucide-react';
import DynamicPieChart from '../projects/components/dynamicPieChart';
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

// Dummy data until the users stats API is available
const dummyGenderCounts: Record<string, number> = {
  MALE: 12,
  FEMALE: 8,
  OTHER: 2,
  UNKNOWN: 1,
};

export default function UserStats() {
  const g = useTranslations('GLOBAL');
  const { formatNum, chartOptions: chartOpts } = useChartNumberOptions();

  const totalCounts = Object.values(dummyGenderCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const genderData = GENDER_ORDER.map((key) => ({
    label: translateValue(g, key, { fallbackStyle: 'raw' }),
    value: dummyGenderCounts[key] || 0,
  }));
  const genderColors = GENDER_ORDER.map((key) => genderColorsMap[key]);

  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-md border bg-card px-6 py-12 text-center">
      <div className="flex max-w-md flex-col items-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Wrench aria-hidden="true" className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Page Under Maintenance
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This page is temporarily unavailable while we prepare the user
          statistics service.
        </p>
      </div>
      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DataCard
          title={g('TOTAL_USERS')}
          number={formatNum(totalCounts)}
          Icon={Users}
          className="w-full rounded-sm"
        />
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[200px] sm:min-h-[300px] lg:col-span-2">
          <h1 className="text-sm font-medium">{g('GENDER_DISTRIBUTION')}</h1>
          <div className="w-full flex-1 flex justify-center p-4 pt-0 items-center">
            <DynamicPieChart
              pieData={genderData}
              colors={genderColors}
              options={chartOpts}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
