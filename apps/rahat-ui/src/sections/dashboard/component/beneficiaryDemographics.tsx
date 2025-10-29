import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';
import MapView from '../mapComponent/mapView';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';

const STATS_CONSTANT = [
  'AGE_GROUPS',
  'BENEFICIARY_TOTAL',
  'TOTAL_NUMBER_FAMILY_MEMBERS',
  'BENEFICIARY_MAP_STATS',
  'BENEFICIARY_GENDER',
];

const BeneficiaryDemographics = ({ benefStats }: any) => {
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
        title="Beneficiary Demographics"
        titleStyle="text-lg"
        description="Summary of household statistics"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        {/* Left Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <DataCard
            title="Total Respondents"
            smallNumber={String(totalRespondents)}
            className="h-24 rounded-sm"
          />
          <DataCard
            title="Total number of Family Members"
            smallNumber={String(totalFamilyMembers)}
            className="h-24 rounded-sm"
          />

          {/* Gender Distribution */}
          <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
            <h1 className="text-sm font-medium">Gender Distribution</h1>
            <div className="w-full flex-1 p-4 pt-0">
              <PieChart
                chart={{
                  series: genderData,
                  colors: genderColors,
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

          {/* Age Group */}
          <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
            <h1 className="text-sm font-medium">Age Group</h1>
            <div className="flex-1 p-2">
              <BarChart
                series={ageGroups.map((item) => item.value)}
                categories={ageGroups.map((item) => item.label)}
                colors={['#4A90E2']}
                xaxisLabels
                yaxisLabels
                barHeight={20}
                height="100%"
                width="100%"
                xaxisTitle="Age Group"
                yaxisTitle="No. of Beneficiaries"
                columnWidth="20%"
              />
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
