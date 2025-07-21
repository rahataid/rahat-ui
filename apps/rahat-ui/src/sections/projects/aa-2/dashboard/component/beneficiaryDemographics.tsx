import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

type Props = {};
const vulnerableStatusStats = [
  { label: '<12', value: 7500 },
  { label: '13–18', value: 1920 },
  { label: '19–29', value: 5620 },
  { label: '30–45', value: 8140 },
  { label: '46–59', value: 1610 },
  { label: '>60', value: 8290 },
];
const BeneficiaryDemographics = (props: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Gender Distribution</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: [
                { label: 'MALE', value: 100 },
                { label: 'FEMALE', value: 200 },
                { label: 'OTHER', value: 80 },
                { label: 'UNKNOWN', value: 50 },
              ],
              colors: ['#4A90E2', '#F06292', '#9B59B6', '#F1C40F'],
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

      {/* Bar Chart */}
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Age Groups</h1>
        <div className="flex-1 p-2">
          <BarChart
            series={vulnerableStatusStats.map((item) => item.value)}
            categories={vulnerableStatusStats.map((item) => item.label)}
            colors={['#4A90E2']}
            xaxisLabels={true}
            yaxisLabels={true}
            barHeight={20}
            height="100%"
            width="100%"
            xaxisTitle="Age Group"
            yaxisTitle="No. of Beneficiaries"
            columnWidth={'20%'}
          />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDemographics;
