import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard } from 'apps/rahat-ui/src/common';
import React from 'react';

type Props = {
  data: {
    benefStats: any[];
    triggeersStats: any[];
  };
};
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

const SSA_LABELS: Record<string, string> = {
  senior_citizen__70: 'Senior Citizen >70',
  senior_citizen__60__dalit: 'Senior Citizen Dalit >60',
  child_nutrition: 'Child Nutrition',
  single_woman: 'Single Women',
  widow: 'Widow',
  red_class: 'Red Card',
  blue_card: 'Blue Card',
  indigenous_community: 'Indigenous Community',
};
const SocialProtectionBenefits = ({
  benefStats,
  triggeersStats,
  projectId,
}: any) => {
  const ssaRaw = benefStats.find((s) => s.name === 'TYPE_OF_SSA')?.data || [];
  const ssaBarData = ssaRaw.map((item: any) => ({
    label: SSA_LABELS[item.id] || item.id,
    value: item.count,
  }));

  // ✅ Extract special categories
  const fieldMapData =
    benefStats.find((s) => s.name === 'FIELD_MAP_RESULT')?.data || {};
  const pregnantCount = fieldMapData.no_of_pregnant_women || 0;
  const lactatingCount = fieldMapData.no_of_lactating_women || 0;
  const disabilityCount = fieldMapData.no_of_persons_with_disability || 0;
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-col lg:flex-row gap-4 ">
        <DataCard
          title="Pregnant Female"
          number={pregnantCount.toString()}
          className="rounded-sm h-24 w-full"
        />
        <DataCard
          title="Lactating Female"
          number={lactatingCount.toString()}
          className="rounded-sm h-24 w-full"
        />
        <DataCard
          title="People with Disabilities"
          number={disabilityCount.toString()}
          className="rounded-sm h-24 w-full"
        />
      </div>

      <div className="border rounded-sm p-2 flex flex-col w-full h-full min-h-[400px] ">
        <h1 className="text-sm font-medium">
          Household Receiving Social Protection Benefits
        </h1>
        <div className="flex-1 p-2">
          <BarChart
            series={ssaBarData.map((item) => item.value)}
            categories={ssaBarData.map((item) => item.label)}
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

export default SocialProtectionBenefits;
