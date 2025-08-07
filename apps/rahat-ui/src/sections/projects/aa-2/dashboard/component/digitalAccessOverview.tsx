'use client';

import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const chartTitles: Record<string, string> = {
  MOBILE_ACCESS: 'Access to Mobile Phones',
  INTERNET_ACCESS: 'Internet Access',
  DIGITAL_WALLET_USE: 'Digital Wallet Use',
  TYPE_OF_PHONE: 'Types of Phone',
};

const defaultColors = ['#00796B', '#CFD8DC', '#4A90E2', '#FFB300'];

interface Props {
  stats: any[];
}

const DigitalAccessOverview = ({ stats }: Props) => {
  const filteredStats = stats.filter((stat) => chartTitles[stat.name]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2 mt-2">
      {filteredStats.map((stat) => {
        const title = chartTitles[stat.name];
        const chartData = stat.data.map((d: any) => ({
          label: d.id,
          value: d.count,
        }));

        return (
          <div
            key={stat.name}
            className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]"
          >
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="w-full flex-1 p-2 pt-0">
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
    </div>
  );
};

export default DigitalAccessOverview;
