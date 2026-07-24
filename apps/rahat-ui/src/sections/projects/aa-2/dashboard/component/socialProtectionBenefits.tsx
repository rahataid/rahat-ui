import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, NoResult } from 'apps/rahat-ui/src/common';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type Props = {
  data: {
    benefStats: any[];
    triggeersStats: any[];
  };
};

const SSA_LABEL_KEYS: Record<string, string> = {
  senior_citizen__70: 'SSA_SENIOR_CITIZEN_70',
  senior_citizen__60__dalit: 'SSA_SENIOR_CITIZEN_60_DALIT',
  child_nutrition: 'SSA_CHILD_NUTRITION',
  single_woman: 'SSA_SINGLE_WOMAN',
  widow: 'SSA_WIDOW',
  red_class: 'SSA_RED_CLASS',
  blue_card: 'SSA_BLUE_CARD',
  indigenous_community: 'SSA_INDIGENOUS_COMMUNITY',
};
const SocialProtectionBenefits = ({
  benefStats,
  triggeersStats,
  projectId,
}: any) => {
  const t = useTranslations('AA Project');
  const formatNum = useNumberFormat();
  const ssaRaw = benefStats.find((s) => s.name === 'TYPE_OF_SSA')?.data || [];
  const ssaBarData = ssaRaw.map((item: any) => ({
    label: t(SSA_LABEL_KEYS[item.id]) || item.id,
    value: item.count,
  }));

  const fieldMapData =
    benefStats.find((s) => s.name === 'FIELD_MAP_RESULT')?.data || {};
  const pregnantCount = fieldMapData.no_of_pregnant_women || 0;
  const lactatingCount = fieldMapData.no_of_lactating_women || 0;
  const disabilityCount = fieldMapData.no_of_persons_with_disability || 0;

  const chartOpts = {
    xaxis: {
      labels: {
        formatter: (val: number) => formatNum(val),
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatNum(val),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatNum(val),
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col">
        <Heading
          title={t('VULNERABLE_GROUPS')}
          titleStyle="text-lg"
          description={t('HOUSEHOLD_MEMBERS_WITH_SPECIFIC_NEEDS_OR')}
        />
        <div className="flex flex-col gap-4 mt-0 md:flex-row">
          <DataCard
            title={t('PREGNANT_FEMALE')}
            number={formatNum(pregnantCount)}
            className="rounded-sm  w-full"
          />
          <DataCard
            title={t('LACTATING_FEMALE')}
            number={formatNum(lactatingCount)}
            className="rounded-sm  w-full"
          />
          <DataCard
            title={t('PEOPLE_WITH_DISABILITIES')}
            number={formatNum(disabilityCount)}
            className="rounded-sm  w-full"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Heading
          title={t('SOCIAL_PROTECTION_BENEFITS')}
          titleStyle="text-lg"
          description={t('HOUSEHOLDS_RECEIVING_GOVERNMENT_SUPPORT')}
        />
        <div className=" border rounded-sm p-4">
          <h1 className="text-sm font-medium">
            {t('HOUSEHOLD_RECEIVING_SOCIAL_PROTECTION_BENEFITS')}
          </h1>
          <div className="flex-1 h-full min-h-[300px]">
            {ssaBarData?.length === 0 ? (
              <div className="flex justify-center h-[300px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
              <BarChart
                series={ssaBarData.map((item) => item.value)}
                categories={ssaBarData.map((item) => item.label)}
                colors={['#4A90E2']}
                xaxisLabels={true}
                yaxisLabels={true}
                barHeight={20}
                height="100%"
                width="100%"
                xaxisTitle={t('TYPE_OF_SSA')}
                yaxisTitle={t('NO_OF_HOUSEHOLDS')}
                columnWidth={'20%'}
                options={chartOpts}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProtectionBenefits;
