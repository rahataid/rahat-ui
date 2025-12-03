import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, NoResult } from 'apps/rahat-ui/src/common';
import { BroadcastStats } from 'apps/rahat-ui/src/types/dashboard';
import React from 'react';
import DynamicPieChart from '../../projects/components/dynamicPieChart';

const CommunicationsAndOutreach = ({
  commsStats,
}: {
  commsStats: BroadcastStats;
}) => {
  return (
    <div className="flex flex-col mt-4">
      <Heading
        title="Communications & Outreach"
        titleStyle="text-lg"
        description="Reach and effectiveness of communication channels"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
        <DataCard
          title="Total Communication Sent"
          className="rounded-sm"
          number={commsStats?.messageStats?.totalMessages.toString()}
        />
      </div>

      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]">
          <h1 className="text-sm font-medium">Communication Channels Used</h1>
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
                xaxisTitle="Communication Channels Used"
                yaxisTitle="No. of messages/broadcasts"
                columnWidth={'20%'}
              />
            )}
          </div>
        </div>
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]">
          <h1 className="text-sm font-medium">
            Communication Success and Failure Rate
          </h1>
          <div className="w-full flex-1 p-4 pt-0">
            <DynamicPieChart
              pieData={[
                {
                  label: 'Success',
                  value: commsStats?.messageStats?.successRate,
                },
                {
                  label: 'Failure',
                  value: 100 - commsStats?.messageStats?.successRate,
                },
              ]}
              colors={['#388E3C', '#D32F2F']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsAndOutreach;
