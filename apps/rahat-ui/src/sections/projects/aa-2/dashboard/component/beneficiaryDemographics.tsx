import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading, NoResult } from 'apps/rahat-ui/src/common';
import { Home, Users } from 'lucide-react';
import React from 'react';
import DynamicPieChart from '../../../components/dynamicPieChart';

type Props = {
  data: {
    benefStats: any[];
    triggeersStats: any[];
  };
};

const BeneficiaryDemographics = ({
  benefStats,
  triggeersStats,
  projectId,
}: any) => {
  // Get gender stats from BENEFICIARY_GENDER
  const genderStats =
    benefStats.find((s) => s.name === 'BENEFICIARY_GENDER')?.data ?? [];
  const genderPieData = genderStats.map((item: any) => ({
    label: item.id,
    value: item.count,
  }));

  // Define consistent gender chart colors
  const genderColorsMap: Record<string, string> = {
    MALE: '#4A90E2',
    FEMALE: '#F06292',
    OTHER: '#9B59B6',
    UNKNOWN: '#F1C40F',
  };
  const genderColors = genderPieData.map(
    (item) => genderColorsMap[item.label] || '#CCCCCC',
  );

  // Get age group stats from BENEFICIARY_AGEGROUPS
  const ageStats =
    benefStats.find((s) => s.name === 'BENEFICIARY_AGEGROUPS')?.data ?? [];

  const ageChartData = ageStats.map((item: any) => ({
    label: item.id,
    value: item.count,
  }));
  const getStat = (name: string) =>
    benefStats?.find((stat: any) => stat.name === name)?.data?.count ?? 0;

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-muted-foreground" />,
      label: 'Total Respondents',
      value: getStat('TOTAL_RESPONDENTS'),
    },
    {
      icon: <Home className="w-5 h-5 text-muted-foreground" />,
      label: 'Total no. of Family Members',
      value: getStat('TOTAL_NUMBER_FAMILY_MEMBERS'),
    },
  ];
  return (
    <div className="flex flex-col">
      <Heading
        title="Beneficiary Demographics"
        titleStyle="text-lg"
        description="Summary of household statistics"
      />

      {/* <div className="flex flex-col gap-4 mt-0 md:flex-row"></div> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {stats.map((stat) => {
          return (
            <DataCard
              title={stat.label}
              number={stat.value.toString()}
              className="rounded-sm  w-full"
              key={stat.label}
            />
          );
        })}
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
          <h1 className="text-sm font-medium">Gender Distribution</h1>
          <div className="w-full flex-1 flex justify-center p-4 pt-0 items-center">
            <DynamicPieChart pieData={genderPieData} colors={genderColors} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
          <h1 className="text-sm font-medium">Age Groups</h1>
          <div className="flex-1 p-2">
            {ageChartData.length === 0 ? (
              <div className="flex justify-center h-[300px] items-center">
                <NoResult size="small" />
              </div>
            ) : (
              <BarChart
                series={ageChartData.map((item) => item.value)}
                categories={ageChartData.map((item) => item.label)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDemographics;
