'use client';

import React from 'react';
import { PieChart, BarChart } from '@rahat-ui/shadcn/src/components/charts';

const chartTitles: Record<string, string> = {
  BENEFICIARY_BANKSTATUS: 'Bank Account Access',
  FLOOD_IMPACT_IN_LAST_5YEARS: 'Flood Impact in Last 5 Years',
  SOCIAL_SECURITY_LINKED_TO_BANK_ACCOUNT:
    'Social Security Linked to Bank Account',
  ACCES_TO_EARLY_WARNING_INFORMATION: 'Access To Early Warning Information',
};

const bankAccounts = [
  { bank: 'NIC Asia Bank Limited', accounts: 12 },
  { bank: 'Global IME', accounts: 250 },
  { bank: 'Agricultural', accounts: 140 },
  // { bank: 'NIC Asia', accounts: 180 },
  // { bank: 'Nepal Bank', accounts: 260 },
  // { bank: 'Kanchan Development Bank', accounts: 130 },
  // { bank: 'Bank 4', accounts: 140 },
  // { bank: 'Rastriya Banijya Bank', accounts: 240 },
  // { bank: 'Everest Bank', accounts: 210 },
  // { bank: 'Nabil Bank', accounts: 270 },
  // { bank: 'Siddhartha Bank', accounts: 190 },
  // { bank: 'Mega Bank', accounts: 175 },
  // { bank: 'Machhapuchchhre Bank', accounts: 160 },
  // { bank: 'Prabhu Bank', accounts: 220 },
  // { bank: 'Laxmi Sunrise Bank', accounts: 200 },
];
const AccessAndResilienceOverview = ({ data }: { data: any }) => {
  const stats = data || [];

  const getStat = (name) => stats.find((item) => item.name === name);

  const pieChartKeys = [
    'BENEFICIARY_BANKSTATUS', // You’ll need to match this to an actual stat if available
    'FLOOD_IMPACT_IN_LAST_5YEARS',
    'SOCIAL_SECURITY_LINKED_TO_BANK_ACCOUNT',
    'ACCES_TO_EARLY_WARNING_INFORMATION',
  ];

  const chartColors = ['#00796B', '#CFD8DC'];

  const beneficiaryCountByBank = getStat('BENEFICIARY_COUNTBYBANK')?.data || [];
  const channelUsageStats = getStat('CHANNEL_USAGE_STATS')?.data || [];

  console.log('dsa', beneficiaryCountByBank);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
      {pieChartKeys.map((key) => {
        const stat = getStat(key);
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
              columnWidth="12%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessAndResilienceOverview;
