'use client';

import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import { useTranslations } from 'next-intl';
import { useChartNumberOptions } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import React from 'react';
import DynamicPieChart from '../../../components/dynamicPieChart';
import { chartTitles } from '../utils/dashbord-constants';

// Translation key per chart, mirroring `chartTitles` in dashbord-constants.
// `chartTitles` stays the source of truth for which charts render; anything
// not mapped here falls back to its shared title so a newly added chart
// renders instead of crashing.
const chartTitleKeys: Record<string, string> = {
  DO_YOU_HAVE_ACCESS_TO_MOBILE_PHONES: 'ACCESS_TO_MOBILE_PHONES',
  DO_YOU_HAVE_ACCESS_TO_INTERNET: 'ACCESS_TO_INTERNET',
  USE_DIGITAL_WALLETS: 'DIGITAL_WALLET_USE',
  TYPE_OF_PHONE: 'TYPES_OF_PHONE',
  HAVE_ACTIVE_BANK_AC: 'BANK_ACCOUNT_ACCESS',
  SSA_RECIPIENT_IN_HH: 'SOCIAL_SECURITY_LINKED_TO_BANK_ACCOUNT',
};

const defaultColors = ['#00796B', '#CFD8DC', '#4A90E2', '#FFB300'];

interface Props {
  stats: any[];
}

const findStat = (data: any[], name: string) => {
  return data.find((s) => s.name === name)?.data ?? [];
};
const DigitalAccessOverview = ({ stats }: Props) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { formatNum, chartOptions } = useChartNumberOptions();

  const getStat = (name: string) => stats.find((item) => item.name === name);
  const beneficiaryCountByBank = getStat('BENEFICIARY_COUNTBYBANK')?.data || [];

  const filteredStats = stats.filter((stat) => chartTitles[stat.name]);

  const pieChartOpts = {
    tooltip: {
      y: {
        formatter: (val: number) => formatNum(val),
      },
    },
  };

  return (
    <div className="mt-4">
      <Heading
        title={t('ACCESS_INCLUSION')}
        titleStyle="text-lg"
        description={t('HOUSEHOLD_PARTICIPATION_IN_BANKING_AND_DIGITAL')}
      />
      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {filteredStats?.map((stat) => {
          const chartData = stat.data.map((d: any) => ({
            label: translateValue(tg, d.id, {
              keyMap: { 'Keypad/Brick': 'BASIC_PHONE_BRICK' },
            }),
            value: d.count,
          }));

          return (
            <div
              key={stat.name}
              className="border rounded-sm pt-2 flex flex-col h-full min-h-[200px] sm:min-h-[280px]"
            >
              <h1 className="text-sm font-medium px-2 ">
                {translateValue(
                  t,
                  chartTitleKeys[stat.name] ?? chartTitles[stat.name],
                  { fallbackStyle: 'raw' },
                )}
              </h1>
              <div className="w-full flex-1 pt-0">
                <DynamicPieChart
                  pieData={chartData}
                  colors={defaultColors.slice(0, chartData.length)}
                  options={pieChartOpts}
                />
              </div>
            </div>
          );
        })}
        <div className="border rounded-sm p-2 flex flex-col h-full  min-h-[280px] lg:col-span-2 ">
          <h1 className="text-sm font-medium">{t('BANK_ACCOUNTS')}</h1>
          <div className="flex-1 overflow-y-auto max-h-[250px] p-2 scrollbar-hidden">
            {beneficiaryCountByBank?.length === 0 ? (
              <div className="flex justify-center h-[230px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
              <BarChart
                series={beneficiaryCountByBank.map((item: any) => item.count)}
                categories={beneficiaryCountByBank.map((item: any) => item.id)}
                colors={['#4A90E2']}
                xaxisLabels={true}
                yaxisLabels={true}
                barHeight={20}
                horizontal={true}
                height={Math.max(beneficiaryCountByBank.length * 30, 200)}
                width="100%"
                xaxisTitle={tg('NO_OF_BENEFICIARIES')}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalAccessOverview;
