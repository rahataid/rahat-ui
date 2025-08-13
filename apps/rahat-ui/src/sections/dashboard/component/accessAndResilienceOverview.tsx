import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const AccessAndResilienceOverview = () => {
  const bankAccounts = [
    { bank: 'NIC Asia Bank Limited', accounts: 12 },
    { bank: 'Global IME', accounts: 250 },
    { bank: 'Agricultural', accounts: 140 },
    { bank: 'NIC Asia', accounts: 180 },
    { bank: 'Nepal Bank', accounts: 260 },
    { bank: 'Kanchan Development Bank', accounts: 130 },
    { bank: 'Bank 4', accounts: 140 },
    { bank: 'Rastriya Banijya Bank', accounts: 240 },
    { bank: 'Everest Bank', accounts: 210 },
    { bank: 'Nabil Bank', accounts: 270 },
    { bank: 'Siddhartha Bank', accounts: 190 },
    { bank: 'Mega Bank', accounts: 175 },
    { bank: 'Machhapuchchhre Bank', accounts: 160 },
    { bank: 'Prabhu Bank', accounts: 220 },
    { bank: 'Laxmi Sunrise Bank', accounts: 200 },
  ];
  const informationChannelsUsed = [
    { channel: 'FM/Radio', beneficiaries: 850 },
    { channel: 'SMS', beneficiaries: 1000 },
    { channel: 'Community', beneficiaries: 700 },
    { channel: 'Social Media', beneficiaries: 900 },
  ];

  return (
    <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1">
        <h1 className="text-sm font-medium">Bank Account Access </h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
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
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1">
        <h1 className="text-sm font-medium">
          Social Security Linked to Bank Account
        </h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
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
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1 lg:col-span-2">
        <h1 className="text-sm font-medium">Bank Account</h1>

        <div className="flex-1 overflow-y-auto max-h-[250px] p-2 scrollbar-hidden">
          <BarChart
            series={bankAccounts.map((item) => item.accounts)}
            categories={bankAccounts.map((item) => item.bank)}
            colors={['#4A90E2']}
            xaxisLabels={true}
            yaxisLabels={true}
            barHeight={20}
            horizontal={true}
            height={bankAccounts.length * 30}
            width="100%"
          />
        </div>
      </div>

      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1">
        <h1 className="text-sm font-medium">Flood Impact in Last 5 Years</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
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
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] col-span-1">
        <h1 className="text-sm font-medium">
          Access To Early Warning Information
        </h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'Yes', value: 75 },
                { label: 'No', value: 25 },
              ],
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
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px] cols-span-1 lg:col-span-2">
        <h1 className="text-sm font-medium">Information Channel Used</h1>
        <div className="flex-1 p-2">
          <BarChart
            series={informationChannelsUsed.map((item) => item.beneficiaries)}
            categories={informationChannelsUsed.map((item) => item.channel)}
            colors={['#4A90E2']}
            xaxisLabels={true}
            yaxisLabels={true}
            barHeight={20}
            height="100%"
            width="100%"
            xaxisTitle="Information Channel"
            yaxisTitle="No. of Beneficiaries"
            columnWidth={'12%'}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessAndResilienceOverview;
