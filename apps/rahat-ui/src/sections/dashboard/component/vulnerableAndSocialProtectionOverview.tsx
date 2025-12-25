// import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
// import { DataCard } from 'apps/rahat-ui/src/common';
// import React from 'react';

// const SocialProtectionOverview = () => {
//   const socialProtectionBenefits = [
//     { type: 'Senior Citizen >70', households: 800 },
//     { type: 'Senior Citizen Dalit >60', households: 950 },
//     { type: 'Child Nutrition ', households: 630 },
//     { type: 'Single Women', households: 850 },
//     { type: 'Widow', households: 620 },
//     { type: 'Red Card', households: 900 },
//     { type: 'Blue Card', households: 790 },
//     { type: 'Indigenous Community', households: 830 },
//   ];
//   return (
//     <div className="grid grid-cols-1 md:lg:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
//       <div className="flex flex-col gap-2 col-span-1">
//         <DataCard
//           title="Pregnant Female"
//           number="12"
//           className="rounded-sm h-24 "
//         />
//         <DataCard
//           title="Lactating Female"
//           number="12"
//           className="rounded-sm h-24 "
//         />
//         <DataCard
//           title="People with Disabilities"
//           number="12"
//           className="rounded-sm h-24 "
//         />
//       </div>

//       <div className="border rounded-sm p-2 flex flex-col w-full h-full min-h-[300px] col-span-1 lg:col-span-2 ">
//         <h1 className="text-sm font-medium">
//           Household Receiving Social Protection Benefits
//         </h1>
//         <div className="flex-1 p-2">
//           <BarChart
//             series={socialProtectionBenefits.map((item) => item.households)}
//             categories={socialProtectionBenefits.map((item) => item.type)}
//             colors={['#4A90E2']}
//             xaxisLabels={true}
//             yaxisLabels={true}
//             barHeight={20}
//             height="100%"
//             width="100%"
//             xaxisTitle="Type of SSA"
//             yaxisTitle="No. of Household"
//             columnWidth={'20%'}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SocialProtectionOverview;

import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, NoResult } from 'apps/rahat-ui/src/common';
import React from 'react';

const labelMap: Record<string, string> = {
  senior_citizen__70: 'Senior Citizen >70',
  senior_citizen__60__dalit: 'Senior Citizen Dalit >60',
  child_nutrition: 'Child Nutrition',
  single_woman: 'Single Women',
  widow: 'Widow',
  red_class: 'Red Card',
  blue_card: 'Blue Card',
  indigenous_community: 'Indigenous Community',
};

const VulnerableAndSocialProtectionOverview = ({
  statsData,
}: {
  statsData: any[];
}) => {
  // Extract stats from data array
  const socialProtection =
    statsData?.find(
      (s) => s.name === 'HOUSEHOLD_RECEIVING_SOCIAL_PROTECTION_BENEFITS',
    )?.data ?? [];

  const vulnerableCount =
    statsData?.find((s) => s.name === 'VULNERABLE_COUNT_STATS')?.data ?? {};

  // Map social protection benefits for chart
  const socialProtectionBenefits = socialProtection.map((item: any) => ({
    type: labelMap[item.id] || item.id,
    households: item.count,
  }));

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Vulnerable Groups Cards */}
      <div className="flex flex-col">
        <Heading
          title="Vulnerable Groups"
          titleStyle="text-lg"
          description="Household members with specific needs or requiring special support"
        />
        <div className="flex gap-4 mt-0 flex-col md:flex-row">
          <DataCard
            title="Pregnant Females"
            number={String(vulnerableCount.no_of_pregnant_women ?? 0)}
            className="rounded-sm h-24 w-full"
          />
          <DataCard
            title="Lactating Females"
            number={String(vulnerableCount.no_of_lactating_women ?? 0)}
            className="rounded-sm h-24 w-full"
          />
          <DataCard
            title="People with Disabilities"
            number={String(vulnerableCount.no_of_persons_with_disability ?? 0)}
            className="rounded-sm h-24 w-full"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Heading
          title="Social Protection Benefits"
          titleStyle="text-lg"
          description="Households receiving government support"
        />
        {/* Social Protection Benefits Bar Chart */}
        <div className=" border rounded-sm p-4">
          <h2 className="text-sm font-medium mb-2">
            Household Receiving Social Protection Benefits
          </h2>
          <div className="flex-1  h-full min-h-[300px]">
            {socialProtectionBenefits.length === 0 ? (
              <div className="flex justify-center h-[300px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
              <BarChart
                series={socialProtectionBenefits.map((item) => item.households)}
                categories={socialProtectionBenefits.map((item) => item.type)}
                colors={['#4A90E2']}
                xaxisLabels={true}
                yaxisLabels={true}
                barHeight={40}
                height="100%"
                width="100%"
                xaxisTitle="Type of SSA"
                yaxisTitle="No. of Households"
                columnWidth="20%"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VulnerableAndSocialProtectionOverview;
