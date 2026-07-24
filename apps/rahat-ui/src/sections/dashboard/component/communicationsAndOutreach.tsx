import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, NoResult } from 'apps/rahat-ui/src/common';
import { BroadcastStats } from 'apps/rahat-ui/src/types/dashboard';
import React from 'react';
import DynamicPieChart from '../../projects/components/dynamicPieChart';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

const CommunicationsAndOutreach = ({
  commsStats,
}: {
  commsStats: BroadcastStats;
}) => {
  const t = useTranslations('Dashboard \u2013 Communications & Outreach');
  const formatNum = useNumberFormat();

  const chartOpts = {
    xaxis: {
      labels: {
        formatter: (val: number) => formatNum(val),
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatNum(val),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatNum(val),
      },
    },
  };

  return (
    <div className="flex flex-col mt-4">
      <Heading
        title={t('COMMUNICATIONS_OUTREACH')}
        titleStyle="text-lg"
        description={t('REACH_AND_EFFECTIVENESS_OF_COMMUNICATION_CHANNELS')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
        <DataCard
          title={t('TOTAL_COMMUNICATION_SENT')}
          className="rounded-sm"
          number={formatNum(commsStats?.messageStats?.totalMessages ?? 0)}
        />
      </div>

      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]">
          <h1 className="text-sm font-medium">{t('COMMUNICATION_CHANNELS_USED')}</h1>
          <div className="flex-1 p-2">
            {commsStats?.transportStats?.length === 0 ? (
              <div className="flex justify-center h-[300px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
              <BarChart
                series={
                  commsStats?.transportStats?.map(
                    (item) => item.totalRecipients,
                  ) || []
                }
                categories={
                  commsStats?.transportStats?.map(
                    (item) =>
                      item.name.charAt(0).toUpperCase() +
                      item.name.slice(1).toLowerCase(),
                  ) || []
                }
                colors={['#4A90E2']}
                xaxisLabels={true}
                yaxisLabels={true}
                barHeight={20}
                height="100%"
                width="100%"
                xaxisTitle={t('COMMUNICATION_CHANNELS_USED')}
                yaxisTitle={t('NO_OF_MESSAGES_BROADCASTS')}
                columnWidth={'20%'}
                options={chartOpts}
              />
            )}
          </div>
        </div>
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]">
          <h1 className="text-sm font-medium">
            {t('COMMUNICATION_SUCCESS_AND_FAILURE_RATE')}
          </h1>
          <div className="w-full flex-1 p-4 pt-0">
            <DynamicPieChart
              pieData={[
                {
                  label: t('SUCCESS'),
                  value: commsStats?.messageStats?.successRate,
                },
                {
                  label: t('FAILURE'),
                  value: 100 - commsStats?.messageStats?.successRate,
                },
              ]}
              colors={['#388E3C', '#D32F2F']}
              options={chartOpts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsAndOutreach;
