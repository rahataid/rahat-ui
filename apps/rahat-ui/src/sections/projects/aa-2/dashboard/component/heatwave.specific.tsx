'use client';

import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import DynamicPieChart from '../../../components/dynamicPieChart';
import { SECTIONS } from '../utils/dashbord-constants';

export default function HeatwaveSpecific({
  benefStats,
}: {
  benefStats: any[];
}) {
  const getStat = (name: string) =>
    benefStats.find((s: any) => s.name === name);

  const barSections = SECTIONS.filter((s) => {
    const stat = getStat(s.name);
    return stat && Array.isArray(stat.data) && stat.data.length;
  });

  const activitiesStatus = getStat('ACTIVITIES_STATUS');
  const activitiesData = activitiesStatus?.data;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Heading
        title="Heat Wave Survey Data"
        titleStyle="text-lg"
        description="Household survey responses"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {barSections.map((section) => {
          const stat = getStat(section.name);
          const categories = stat.data.map((d: any) => d.id);
          const series = stat.data.map((d: any) => d.count);
          return (
            <div
              key={section.name}
              className="border rounded-sm p-2 flex flex-col h-full min-h-[260px]"
            >
              <h1 className="text-sm font-medium mb-1">{section.title}</h1>
              <div className="flex-1">
                {categories.length <= 2 ? (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <DynamicPieChart
                      pieData={stat.data.map((d: any) => ({
                        label: d.id,
                        value: d.count,
                      }))}
                    />
                  </div>
                ) : (
                  <BarChart
                    series={series}
                    categories={categories}
                    colors={['#4A90E2']}
                    horizontal
                    barHeight={categories.length <= 6 ? 20 : 12}
                    height={Math.max(categories.length * 35, 200)}
                    width="100%"
                    xaxisLabels
                    yaxisLabels
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {Array.isArray(activitiesData) && activitiesData.length > 0 && (
        <div className="border rounded-sm p-2">
          <h1 className="text-sm font-medium mb-2">Activities Status</h1>
          <BarChart
            series={activitiesData.map((d: any) => d.count ?? 0)}
            categories={activitiesData.map((d: any) => d.id ?? d.name ?? '')}
            colors={['#4A90E2']}
            xaxisLabels
            yaxisLabels
            barHeight={20}
            height={Math.max(activitiesData.length * 40, 200)}
            width="100%"
            xaxisTitle="Activity"
            yaxisTitle="Count"
          />
        </div>
      )}

      {!barSections.length && !activitiesData?.length && (
        <div className="flex justify-center py-8">
          <NoResult size="small" />
        </div>
      )}
    </div>
  );
}
