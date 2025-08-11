'use client';

import React from 'react';
import { PieChart, BarChart } from '@rahat-ui/shadcn/src/components/charts';

const chartTitles: Record<string, string> = {
  HAVE_ACTIVE_BANK_AC: 'Bank Account Access',
  FLOOD_AFFECTED_IN_5_YEARS: 'Flood Impact in Last 5 Years',
  SSA_RECIPIENT_IN_HH: 'Social Security Linked to Bank Account',
  RECEIVE_DISASTER_INFO: 'Access To Early Warning Information',
};

const AccessAndResilienceOverview = ({ data }: { data: any }) => {
  const stats = data || [];

  const getStat = (name) => stats.find((item) => item.name === name);

  const pieChartKeys = [
    'HAVE_ACTIVE_BANK_AC',
    'SSA_RECIPIENT_IN_HH',
    'FLOOD_AFFECTED_IN_5_YEARS',
    'RECEIVE_DISASTER_INFO',
  ];

  const chartColors = ['#00796B', '#CFD8DC'];

  const beneficiaryCountByBank = getStat('BENEFICIARY_COUNTBYBANK')?.data || [];
  const channelUsageStats = getStat('CHANNEL_USAGE_STATS')?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
      {pieChartKeys.map((key) => {
        const stat = getStat(key);
        console.log(chartTitles[key], 'l', key);
        if (!stat || !Array.isArray(stat.data)) return null;

        const pieData = stat.data.map((item) => ({
          label: item.id,
          value: item.count,
        }));

        return (
          <div
            key={key}
            className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1"
          >
            <h1 className="text-sm font-medium">{chartTitles[key]}</h1>
            <div className="w-full flex-1 p-4 pt-0">
              <PieChart
                chart={{
                  series: pieData,
                  colors: chartColors,
                }}
                custom
                projectAA
                donutSize="80%"
                width="100%"
                height="100%"
                type="donut"
              />
            </div>
          </div>
        );
      })}

      {/* Bar chart: Bank Accounts */}
      {
        <div className="border rounded-sm p-2 flex flex-col h-full  min-h-[350px] lg:col-span-2 col-span-1">
          <h1 className="text-sm font-medium">Bank Accounts</h1>
          <div className="flex-1 overflow-y-auto max-h-[250px] p-2 scrollbar-hidden">
            <BarChart
              series={beneficiaryCountByBank.map((item) => item.count)}
              categories={beneficiaryCountByBank.map((item) => item.id)}
              colors={['#4A90E2']}
              xaxisLabels={true}
              yaxisLabels={true}
              barHeight={20}
              horizontal={true}
              height={Math.max(beneficiaryCountByBank.length * 30, 200)}
              width="100%"
            />
          </div>
        </div>
      }

      {/* Bar chart: Information Channel */}
      {channelUsageStats.length > 0 && (
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[350px] lg:col-span-2 col-span-1">
          <h1 className="text-sm font-medium">Information Channels Used</h1>
          <div className="flex-1 p-2">
            <BarChart
              series={channelUsageStats.map((item) => item.count)}
              categories={channelUsageStats.map((item) => item.id)}
              colors={['#4A90E2']}
              xaxisLabels={true}
              yaxisLabels={true}
              barHeight={20}
              height="100%"
              width="100%"
              xaxisTitle="Information Channel"
              yaxisTitle="No. of Beneficiaries"
              columnWidth="20%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessAndResilienceOverview;
