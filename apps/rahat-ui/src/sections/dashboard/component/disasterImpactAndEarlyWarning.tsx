import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import React from 'react';
import DynamicPieChart from '../../projects/components/dynamicPieChart';

const DisasterImpactAndEarlyWarning = ({ statsData }: { statsData: any[] }) => {
  // Helper to find stat data by name
  const getStat = (name: string) =>
    statsData?.find((s) => s.name === name)?.data ?? [];

  const floodImpact = getStat('FLOOD_IMPACT_IN_LAST_5YEARS');
  const earlyWarningAccess = getStat('ACCES_TO_EARLY_WARNING_INFORMATION');

  const channelUsageStats = getStat('CHANNEL_USAGE_STATS');

  return (
    <div className="flex flex-col mt-4">
      <Heading
        title="Disaster Impact & Early Warning"
        titleStyle="text-lg"
        description="Flood Impact History & Early Warning Access"
      />
      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
        {[
          { title: 'Flood Impact in Last 5 Years', data: floodImpact },
          {
            title: 'Access To Early Warning Information',
            data: earlyWarningAccess,
          },
        ].map(({ title, data }) => (
          <div
            key={title}
            className="border rounded-sm p-2 flex flex-col h-full min-h-[340px] col-span-1"
          >
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="w-full flex-1 p-4 pt-0">
              <DynamicPieChart
                pieData={data.map((item: any) => ({
                  label: item.id,
                  value: item.count,
                }))}
                colors={['#00796B', '#CFD8DC']}
              />
            </div>
          </div>
        ))}

        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[340px] lg:col-span-2">
          <h1 className="text-sm font-medium">Information Channel Used</h1>
          <div className="flex-1 p-2">
            {channelUsageStats?.length === 0 ? (
              <div className="flex justify-center h-[300px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
              <BarChart
                series={channelUsageStats.map((item: any) => item.count)}
                // categories={channelUsageStats.map((item: any) => item.id)}
                categories={channelUsageStats.map((item: any) =>
                  item.id.replace(/([A-Z])/g, ' $1').trim(),
                )}
                colors={['#4A90E2']}
                xaxisLabels={true}
                yaxisLabels={true}
                barHeight={20}
                height="100%"
                width="100%"
                xaxisTitle="Information Channel"
                yaxisTitle="No. of Beneficiaries"
                columnWidth={'20%'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterImpactAndEarlyWarning;
