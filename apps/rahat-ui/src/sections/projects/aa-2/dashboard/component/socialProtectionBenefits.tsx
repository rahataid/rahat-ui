import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard } from 'apps/rahat-ui/src/common';
import React from 'react';

type Props = {};
const socialProtectionBenefits = [
  { type: ' >70', households: 800 },
  { type: ' Dalit >60', households: 950 },
  { type: 'Child ', households: 630 },
  { type: 'Single', households: 850 },
  { type: 'Widow', households: 620 },
  { type: 'Red ', households: 900 },
  { type: 'Blue ', households: 790 },
  { type: 'Indigenous', households: 830 },
];
const SocialProtectionBenefits = (props: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-col lg:flex-row gap-4 ">
        <DataCard
          title="Pregant Female"
          number="12"
          className="rounded-sm h-24  w-full"
        />
        <DataCard
          title="Lactatiing Female"
          number="12"
          className="rounded-sm h-24 w-full"
        />
        <DataCard
          title="People with Disabilities"
          number="12"
          className="rounded-sm h-24 w-full"
        />
      </div>

      <div className="border rounded-sm p-2 flex flex-col w-full h-full min-h-[400px] ">
        <h1 className="text-sm font-medium">
          Household Receiving Social Protection Benefits
        </h1>
        <div className="flex-1 p-2">
          <BarChart
            series={socialProtectionBenefits.map((item) => item.households)}
            categories={socialProtectionBenefits.map((item) => item.type)}
            colors={['#4A90E2']}
            xaxisLabels={true}
            yaxisLabels={true}
            barHeight={20}
            height="100%"
            width="100%"
            xaxisTitle="Type of SSA"
            yaxisTitle="No. of Household"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialProtectionBenefits;
