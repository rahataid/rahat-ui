import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { NoResult } from 'apps/rahat-ui/src/common';
import React from 'react';

interface IDynamicPieChartProps {
  pieData: {
    label: string;
    value: number;
  }[];
  isLoading?: boolean;
  colors: string[];
}
const DynamicPieChart = ({
  pieData,
  isLoading,
  colors,
}: IDynamicPieChartProps) => {
  const total = pieData?.reduce(
    (s: number, it: { label: string; value: number }) =>
      s + Number(it.value || 0),
    0,
  );

  if (isLoading) {
    return <Loader />;
  }

  if (pieData.length === 0) {
    return <NoResult size="small" />;
  }

  if (total === 0) {
    // show gray donut placeholder and list fields with values (e.g., Male: 0)
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          className="max-w-[200px] max-h-[200px] w-40 h-40"
          viewBox="0 0 120 120"
          role="img"
          aria-label="No data"
        >
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="transparent"
            stroke="#E0E0E0"
            strokeWidth="16"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm">No Data</p>
        </div>
      </div>
    );
  }

  return (
    <PieChart
      chart={{
        series: pieData,
        colors: colors,
      }}
      custom
      projectAA
      donutSize="80%"
      width="100%"
      height="100%"
      type="donut"
    />
  );
};

export default DynamicPieChart;
