import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard } from 'apps/rahat-ui/src/common';
import React from 'react';

const SocialProtectionOverview = () => {
  const socialProtectionBenefits = [
    { type: 'Senior Citizen >70', households: 800 },
    { type: 'Senior Citizen Dalit >60', households: 950 },
    { type: 'Child Nutrition ', households: 630 },
    { type: 'Single Women', households: 850 },
    { type: 'Widow', households: 620 },
    { type: 'Red Card', households: 900 },
    { type: 'Blue Card', households: 790 },
    { type: 'Indigenous Community', households: 830 },
  ];
  return (
    <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
      <div className="flex flex-col gap-2 col-span-1">
        <DataCard
          title="Pregnant Female"
          number="12"
          className="rounded-sm h-24 "
        />
        <DataCard
          title="Lactating Female"
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
            columnWidth={'15%'}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialProtectionOverview;
