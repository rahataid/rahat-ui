'use client';

import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { Heading } from 'apps/rahat-ui/src/common';
import { stat } from 'fs';
import React from 'react';

const chartTitles: Record<string, string> = {
  DO_YOU_HAVE_ACCESS_TO_MOBILE_PHONES: 'DO_YOU_HAVE_ACCESS_TO_MOBILE_PHONES',
  DO_YOU_HAVE_ACCESS_TO_INTERNET: 'DO_YOU_HAVE_ACCESS_TO_INTERNET',
  USE_DIGITAL_WALLETS: 'USE_DIGITAL_WALLETS',
  TYPE_OF_PHONE: 'TYPE_OF_PHONE',
  HAVE_ACTIVE_BANK_AC: 'Bank Account Access',
  SSA_RECIPIENT_IN_HH: 'Social Security Linked to Bank Account',
};

const defaultColors = ['#00796B', '#CFD8DC', '#4A90E2', '#FFB300'];

interface Props {
  stats: any[];
}

const findStat = (data: any[], name: string) => {
  return data.find((s) => s.name === name)?.data ?? [];
};
const DigitalAccessOverview = ({ stats }: Props) => {
  // const stats = data || [];

  const getStat = (name) => stats.find((item) => item.name === name);
  const beneficiaryCountByBank = getStat('BENEFICIARY_COUNTBYBANK')?.data || [];

  const filteredStats = stats.filter((stat) => chartTitles[stat.name]);
  return (
    <div className="mt-4">
      <Heading
        title="Access & Inclusion"
        titleStyle="text-lg"
        description="Household participation in banking and digital finance systems"
      />
      <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {filteredStats.map((stat) => {
          let title = chartTitles[stat.name]
            .replace(/^DO_YOU_HAVE_/, '') // remove prefix
            .replace(/_/g, ' ') // replace all underscores
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase());
          if (title === 'Use digital wallets') {
            title = 'Digital wallet use';
          }
          const chartData = stat.data.map((d: any) => ({
            label: d.id,
            value: d.count,
          }));

          return (
            <div
              key={stat.name}
              className="border rounded-sm pt-2 flex flex-col h-full min-h-[280px]"
            >
              <h1 className="text-sm font-medium px-2 ">{title}</h1>
              <div className="w-full flex-1 pt-0">
                <PieChart
                  chart={{
                    series: chartData,
                    colors: defaultColors.slice(0, chartData.length),
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
          );
        })}
        <div className="border rounded-sm p-2 flex flex-col h-full  min-h-[280px] lg:col-span-2 ">
          <h1 className="text-sm font-medium">Bank Accounts</h1>
          <div className="flex-1 overflow-y-auto max-h-[250px] p-2 scrollbar-hidden">
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
              xaxisTitle="No. of Beneficiaries"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalAccessOverview;
