import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const findStat = (data: any[], name: string) => {
  return data.find((s) => s.name === name)?.data ?? [];
};

// Optional: assign colors per label to keep consistent palette for yes/no, phone types etc.
const colorMap: Record<string, string> = {
  Yes: '#00796B',
  No: '#CFD8DC',
  Smartphone: '#00796B',
  'Keypad/Brick': '#CFD8DC',
  Both: '#4A90E2',
};

const DigitalAccessOverview = ({ statsData }: { statsData: any[] }) => {
  // Extract relevant stats
  const mobileAccess = findStat(statsData, 'MOBILE_ACCESS');
  const internetAccess = findStat(statsData, 'INTERNET_ACCESS');
  const digitalWalletUse = findStat(statsData, 'DIGITAL_WALLET_USE');
  const typeOfPhone = findStat(statsData, 'TYPE_OF_PHONE');

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
  ];

  return (
    <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
      {charts.map(({ title, data }, idx) => {
        if (!data || data.length === 0) return null; // skip if no data

        const chart = buildChartData(data);

        return (
          <div
            key={idx}
            className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]"
          >
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="w-full flex-1 p-4 pt-0">
              <PieChart
                chart={chart}
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
    </div>
  );
};

export default DigitalAccessOverview;
