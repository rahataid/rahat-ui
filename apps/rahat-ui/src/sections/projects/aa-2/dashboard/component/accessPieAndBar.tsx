'use client';

import React from 'react';
import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import { useChartNumberOptions } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useTranslations } from 'next-intl';
import DynamicPieChart from '../../../components/dynamicPieChart';

const chartTitleKeys: Record<string, string> = {
  FLOOD_AFFECTED_IN_5_YEARS: 'FLOOD_IMPACT_IN_LAST5_YEARS',
  RECEIVE_DISASTER_INFO: 'ACCESS_TO_EARLY_WARNING_INFORMATION',
};

const AccessAndResilienceOverview = ({ data }: { data: any }) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { formatNum, chartOptions } = useChartNumberOptions();
  const stats = data || [];

  const getStat = (name) => stats.find((item) => item.name === name);

  const pieChartKeys = [
    'FLOOD_AFFECTED_IN_5_YEARS',
    'RECEIVE_DISASTER_INFO',
  ];

  const chartColors = ['#00796B', '#CFD8DC'];

  const channelUsageStats = getStat('CHANNEL_USAGE_STATS')?.data || [];

  const pieChartOpts = {
    tooltip: {
      y: {
        formatter: (val: number) => formatNum(val),
      },
    },
  };

  return (
    <div className="flex flex-col mt-4">
      <Heading
        title={t('DISASTER_IMPACT_EARLY_WARNING')}
        titleStyle="text-lg"
        description={t('FLOOD_IMPACT_HISTORY_EARLY_WARNING_ACCESS')}
      />
      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-4 mt-2">
        {pieChartKeys.map((key) => {
          const stat = getStat(key);
          if (!stat || !Array.isArray(stat.data)) return null;

          const pieData = stat.data
            .filter((item: any) => item.count > 0)
            .map((item: any) => ({
              label: translateValue(tg, item.id, { fallbackStyle: 'raw' }),
              value: item.count,
            }));

          return (
            <div
              key={key}
              className="border rounded-sm p-2 flex flex-col h-full min-h-[200px] sm:min-h-[290px] col-span-1"
            >
              <h1 className="text-sm font-medium">{t(chartTitleKeys[key])}</h1>
              <div className="w-full flex-1 p-4 pt-0">
                <DynamicPieChart pieData={pieData} colors={chartColors} options={pieChartOpts} />
              </div>
            </div>
          );
        })}
        <div className="flex flex-col h-full min-h-[240px] sm:min-h-[340px] lg:col-span-2">
          {/* Bar chart: Information Channel */}
          <div className="border rounded-sm p-2 flex flex-col h-full min-h-[250px] sm:min-h-[350px] lg:col-span-2 col-span-1">
            <h1 className="text-sm font-medium">
              {t('INFORMATION_CHANNELS_USED')}
            </h1>
            <div className="flex-1 p-2">
              {channelUsageStats.length === 0 ? (
                <div className="flex justify-center h-[300px] items-center">
                  <NoResult size="small" />
                </div>
              ) : (
                <BarChart
                  series={channelUsageStats.map((item) => item.count)}
                  categories={channelUsageStats.map((item) =>
                    translateValue(tg, item.id, {
                      keyMap: {
                        FmRadio: 'FM_RADIO',
                        MobilePhoneSms: 'MOBILE_PHONE_SMS',
                        PeopleRepresentatives: 'PEOPLE_REPRESENTATIVES',
                        SocialMedia: 'SOCIAL_MEDIA',
                      },
                      fallbackStyle: 'humanized',
                    }),
                  )}
                  colors={['#4A90E2']}
                  xaxisLabels={true}
                  yaxisLabels={true}
                  barHeight={20}
                  height="100%"
                  width="100%"
                  xaxisTitle={t('INFORMATION_CHANNEL')}
                  yaxisTitle={tg('NO_OF_BENEFICIARIES')}
                  columnWidth="23%"
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessAndResilienceOverview;
