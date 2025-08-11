import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const AccessAndResilienceOverview = ({ statsData }: { statsData: any[] }) => {
  // Helper to find stat data by name
  const getStat = (name: string) =>
    statsData.find((s) => s.name === name)?.data ?? [];

  // Extract and map pie chart data
  const bankAccountAccess = getStat('BANK_ACCOUNT_ACCESS');
  const socialSecurityLinked = getStat(
    'SOCIAL_SECURITY_LINKED_TO_BANK_ACCOUNT',
  );
  const floodImpact = getStat('FLOOD_IMPACT_IN_LAST_5YEARS');
  const earlyWarningAccess = getStat('ACCES_TO_EARLY_WARNING_INFORMATION');

  // Extract bar chart data
  const bankCountStats = getStat('BANK_COUNT_STATS');
  const channelUsageStats = getStat('CHANNEL_USAGE_STATS');

  return (
    <div>
      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
        {[
          { title: 'Bank Account Access', data: bankAccountAccess },
          {
            title: 'Social Security Linked to Bank Account',
            data: socialSecurityLinked,
          },
          { title: 'Flood Impact in Last 5 Years', data: floodImpact },
          {
            title: 'Access To Early Warning Information',
            data: earlyWarningAccess,
          },
        ].map(({ title, data }) => (
          <div
            key={title}
            className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1"
          >
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="w-full flex-1 p-4 pt-0">
              <PieChart
                chart={{
                  series: data.map((item: any) => ({
                    label: item.id,
                    value: item.count,
                  })),
                  colors: ['#00796B', '#CFD8DC'],
                }}
                custom={true}
                projectAA={true}
                donutSize="80%"
                width="100%"
                height="100%"
                type="donut"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        <div className="border rounded-sm p-2 flex flex-col h-full  min-h-[350px] lg:col-span-1 col-span-1">
          <h1 className="text-sm font-medium">Bank Accounts</h1>
          <div className="flex-1 overflow-y-auto max-h-[250px] p-2 scrollbar-hidden">
            <BarChart
              series={bankCountStats.map((item: any) => item.count)}
              categories={bankCountStats.map((item: any) => item.id)}
              colors={['#4A90E2']}
              xaxisLabels={true}
              yaxisLabels={true}
              barHeight={20}
              horizontal={true}
              height={Math.max(bankCountStats.length * 30, 200)}
              width="100%"
            />
          </div>
        </div>
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1 lg:col-span-2">
          <h1 className="text-sm font-medium">Information Channel Used</h1>
          <div className="flex-1 p-2">
            <BarChart
              series={channelUsageStats.map((item: any) => item.count)}
              categories={channelUsageStats.map((item: any) => item.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessAndResilienceOverview;
