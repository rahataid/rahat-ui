import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Gender Distribution</h1>
        <div className="w-full flex-1 p-4 pt-0">
          <PieChart
            chart={{
              series: genderPieData,
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

      {/* Bar Chart */}
      <div className="border rounded-sm p-2 flex flex-col h-full min-h-[300px]">
        <h1 className="text-sm font-medium">Age Groups</h1>
        <div className="flex-1 p-2">
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
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDemographics;
