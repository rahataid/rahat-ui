import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard } from 'apps/rahat-ui/src/common';
import React from 'react';

const SocialProtectionOverview = () => {
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
  return (
    <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
      <div className="flex flex-col gap-2 col-span-1">
        <DataCard
          title="Pregant Female"
          number="12"
          className="rounded-sm h-24 "
        />
        <DataCard
          title="Lactatiing Female"
          number="12"
          className="rounded-sm h-24 "
        />
        <DataCard
          title="People with Disabilities"
          number="12"
          className="rounded-sm h-24 "
        />
      </div>

      <div className="border rounded-sm p-2 flex flex-col w-full h-full min-h-[300px] col-span-1 lg:col-span-2 ">
        <h1 className="text-lg font-medium">
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

export default SocialProtectionOverview;
