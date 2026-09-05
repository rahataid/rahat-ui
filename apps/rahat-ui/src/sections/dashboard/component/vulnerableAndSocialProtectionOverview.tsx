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
import { useTranslations } from 'next-intl';
import { useChartNumberOptions } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

// Backend SSA type ids don't derive cleanly to a key (double underscores,
// no SSA_ prefix), so map each one explicitly rather than relying on the
// generic derivation.
const SSA_TYPE_KEYS: Record<string, string> = {
  senior_citizen__70: 'SSA_SENIOR_CITIZEN_70',
  senior_citizen__60__dalit: 'SSA_SENIOR_CITIZEN_DALIT_60',
  child_nutrition: 'SSA_CHILD_NUTRITION',
  single_woman: 'SSA_SINGLE_WOMEN',
  widow: 'SSA_WIDOW',
  red_class: 'SSA_RED_CARD',
  blue_card: 'SSA_BLUE_CARD',
  indigenous_community: 'SSA_INDIGENOUS_COMMUNITY',
};

const VulnerableAndSocialProtectionOverview = ({
  statsData,
}: {
  statsData: any[];
}) => {
  const t = useTranslations('DASHBOARD_VULNERABLE_SOCIAL_PROTECTION');
  const { formatNum, chartOptions: chartOpts } = useChartNumberOptions();
  // Extract stats from data array
  const socialProtection =
    statsData?.find(
      (s) => s.name === 'HOUSEHOLD_RECEIVING_SOCIAL_PROTECTION_BENEFITS',
    )?.data ?? [];

  const vulnerableCount =
    statsData?.find((s) => s.name === 'VULNERABLE_COUNT_STATS')?.data ?? {};

  // Map social protection benefits for chart
  const socialProtectionBenefits = socialProtection.map((item: any) => ({
    type: translateValue(t, item.id, {
      keyMap: SSA_TYPE_KEYS,
      fallbackStyle: 'raw',
    }),
    households: item.count,
  }));


  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Vulnerable Groups Cards */}
      <div className="flex flex-col">
        <Heading
          title={t('VULNERABLE_GROUPS')}
          titleStyle="text-lg"
          description={t('HOUSEHOLD_MEMBERS_WITH_SPECIFIC_NEEDS_OR')}
        />
        <div className="flex gap-4 mt-0 flex-col md:flex-row">
          <DataCard
            title={t('PREGNANT_FEMALES')}
            number={formatNum(vulnerableCount.no_of_pregnant_women ?? 0)}
            className="rounded-sm h-24 w-full"
          />
          <DataCard
            title={t('LACTATING_FEMALES')}
            number={formatNum(vulnerableCount.no_of_lactating_women ?? 0)}
            className="rounded-sm h-24 w-full"
          />
          <DataCard
            title={t('PEOPLE_WITH_DISABILITIES')}
            number={formatNum(vulnerableCount.no_of_persons_with_disability ?? 0)}
            className="rounded-sm h-24 w-full"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Heading
          title={t('SOCIAL_PROTECTION_BENEFITS')}
          titleStyle="text-lg"
          description={t('HOUSEHOLDS_RECEIVING_GOVERNMENT_SUPPORT')}
        />
        {/* Social Protection Benefits Bar Chart */}
        <div className=" border rounded-sm p-4">
          <h2 className="text-sm font-medium mb-2">
            {t('HOUSEHOLD_RECEIVING_SOCIAL_PROTECTION_BENEFITS')}
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
                xaxisTitle={t('TYPE_OF_SSA')}
                yaxisTitle={t('NO_OF_HOUSEHOLDS')}
                columnWidth="20%"
                options={chartOpts}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VulnerableAndSocialProtectionOverview;
