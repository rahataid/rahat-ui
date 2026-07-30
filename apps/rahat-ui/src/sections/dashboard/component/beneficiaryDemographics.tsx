import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';
import MapView from '../mapComponent/mapView';
import { DataCard, Heading, NoResult } from 'apps/rahat-ui/src/common';
import DynamicPieChart from '../../projects/components/dynamicPieChart';
import { useTranslations } from 'next-intl';
import { useNumberFormat, useLabelDigits } from 'apps/rahat-ui/src/utils/useNumberFormat';

const STATS_CONSTANT = [
  'AGE_GROUPS',
  'BENEFICIARY_TOTAL',
  'TOTAL_NUMBER_FAMILY_MEMBERS',
  'BENEFICIARY_MAP_STATS',
  'BENEFICIARY_GENDER',
];

const BeneficiaryDemographics = ({ benefStats }: any) => {
  const t = useTranslations('DASHBOARD_BENEFICIARY_DEMOGRAPHICS');
  const g = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatLabel = useLabelDigits();
  // Helper to get stat by name
  const getStat = (name: string) =>
    benefStats?.find((s) => s.name === name)?.data ?? [];

  // Map over `k` and build object keyed by stat name
  const mappedStats = STATS_CONSTANT.reduce((acc, key) => {
    acc[key] = getStat(key);
    return acc;
  }, {} as Record<string, any>);

  // Numbers
  const totalRespondents = mappedStats['BENEFICIARY_TOTAL']?.count ?? 0;
  const totalFamilyMembers =
    mappedStats['TOTAL_NUMBER_FAMILY_MEMBERS']?.count ?? 0;

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

  // Age chart
  const ageGroups = (mappedStats['AGE_GROUPS'] || []).map((item: any) => ({
    label: item.id,
    value: item.count,
  }));

  // Gender chart
  const genderColorsMap: Record<string, string> = {
    MALE: '#4A90E2',
    FEMALE: '#F06292',
    OTHER: '#9B59B6',
    UNKNOWN: '#F1C40F',
  };
  const genderData = (mappedStats['BENEFICIARY_GENDER'] || []).map(
    (item: any) => ({
      label: item.id,
      value: item.count,
    }),
  );
  const genderColors = genderData.map(
    (g) => genderColorsMap[g.label] || '#CCCCCC',
  );

  return (
    <div className="flex flex-col">
      <Heading
        title={t('BENEFICIARY_DEMOGRAPHICS')}
        titleStyle="text-lg"
        description={t('SUMMARY_OF_HOUSEHOLD_STATISTICS')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        {/* Left Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <DataCard
            title={t('TOTAL_RESPONDENTS')}
            smallNumber={formatNum(totalRespondents)}
            className="h-24 rounded-sm"
          />
          <DataCard
            title={t('TOTAL_NUMBER_OF_FAMILY_MEMBERS')}
            smallNumber={formatNum(totalFamilyMembers)}
            className="h-24 rounded-sm"
          />

          {/* Gender Distribution */}
          <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
            <h1 className="text-sm font-medium">{t('GENDER_DISTRIBUTION')}</h1>
            <div className="w-full flex-1 p-4 pt-0 flex justify-center items-center">
              <DynamicPieChart pieData={genderData} colors={genderColors} options={chartOpts} />
            </div>
          </div>

          {/* Age Group */}
          <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
            <h1 className="text-sm font-medium">{t('AGE_GROUP')}</h1>
            <div className="flex-1 p-2">
              {ageGroups.length === 0 ? (
                <div className="flex justify-center h-[300px] items-center">
                  <NoResult size="small" />
                </div>
              ) : (
                <BarChart
                  series={ageGroups.map((item) => item.value)}
                  categories={ageGroups.map((item) => formatLabel(item.label))}
                  colors={['#4A90E2']}
                  xaxisLabels
                  yaxisLabels
                  barHeight={20}
                  height="100%"
                  width="100%"
                  xaxisTitle={t('AGE_GROUP')}
                  yaxisTitle={g('NO_OF_BENEFICIARIES')}
                  columnWidth="20%"
                  options={chartOpts}
                />
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="min-h-[300px] h-full mb-2">
          <MapView mapLocation={mappedStats['BENEFICIARY_MAP_STATS']} />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDemographics;
