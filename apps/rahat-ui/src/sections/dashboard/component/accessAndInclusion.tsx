import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import React from 'react';
import DynamicPieChart from '../../projects/components/dynamicPieChart';

const findStat = (data: any[], name: string) => {
  return data?.find((s) => s.name === name)?.data ?? [];
};

// Optional: assign colors per label to keep consistent palette for yes/no, phone types etc.
const colorMap: Record<string, string> = {
  Yes: '#00796B',
  No: '#CFD8DC',
  Smartphone: '#00796B',
  'Keypad/Brick': '#CFD8DC',
  Both: '#4A90E2',
};

const AccessAndInclusion = ({ statsData }: { statsData: any[] }) => {
  // Extract relevant stats
  const mobileAccess = findStat(statsData, 'MOBILE_ACCESS');
  const internetAccess = findStat(statsData, 'INTERNET_ACCESS');
  const digitalWalletUse = findStat(statsData, 'DIGITAL_WALLET_USE');
  const typeOfPhone = findStat(statsData, 'TYPE_OF_PHONE');
  const bankAccountAccess = findStat(statsData, 'BANK_ACCOUNT_ACCESS');
  const socialSecurityLinked = findStat(
    statsData,
    'SOCIAL_SECURITY_LINKED_TO_BANK_ACCOUNT',
  );
  const bankCountStats = findStat(statsData, 'BANK_COUNT_STATS');

  // Helper to build chart series + colors from data array
  const buildChartData = (data: any[]) => {
    return {
      series: data.map((item) => ({
        label: item.id,
        value: item.count,
      })),
      colors: data.map((item) => colorMap[item.id] || '#888888'),
    };
  };

  // Prepare charts data
  const charts = [
    { title: 'Access to Mobile Phones', data: mobileAccess },
    { title: 'Internet Access', data: internetAccess },
    { title: 'Digital Wallet Use', data: digitalWalletUse },
    { title: 'Types of Phone', data: typeOfPhone },
    { title: 'Bank Account Access', data: bankAccountAccess },
    {
      title: 'Social Security Linked to Bank Account',
      data: socialSecurityLinked,
    },
  ];

  return (
    <div className="mt-4">
      <Heading
        title="Access & Inclusion"
        titleStyle="text-lg"
        description="Household participation in banking and digital finance systems"
      />
      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
        {charts.map(({ title, data }, idx) => {
          if (!data || data.length === 0) return null; // skip if no data

          const chart = buildChartData(data);

          return (
            <div
              key={idx}
              className="border rounded-sm p-2 flex flex-col h-full min-h-[320px]"
            >
              <h1 className="text-sm font-medium">{title}</h1>
              <div className="w-full flex-1 p-4 pt-0">
                <DynamicPieChart pieData={chart.series} colors={chart.colors} />
                {/* <PieChart
                  chart={chart}
                  custom
                  projectAA
                  donutSize="80%"
                  width="100%"
                  height="100%"
                  type="donut"
                /> */}
              </div>
            </div>
          );
        })}
        <div className="border rounded-sm p-2 flex flex-col h-full  min-h-[300px] lg:col-span-2 ">
          <h1 className="text-sm font-medium">Bank Accounts</h1>
          <div className="flex-1 overflow-y-auto max-h-[200px] p-2 scrollbar-hidden">
            {bankCountStats.length === 0 ? (
              <div className="flex justify-center h-[300px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
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
                xaxisTitle="No. of Beneficiaries"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessAndInclusion;
