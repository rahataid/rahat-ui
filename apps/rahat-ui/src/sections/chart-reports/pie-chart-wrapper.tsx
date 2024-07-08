import { PieChart } from '@rahat-ui/shadcn/src/components/charts';

type PiechartData = {
  component: any;
  source: any;
  actualData: any;
  availableStatsKeys: string[];
};

const PieChartWrapper = ({
  actualData,
  component,
  source,
  availableStatsKeys,
}: PiechartData) => {
  console.log('actualData,component,source', { actualData, component, source });

  const chartStatsData = availableStatsKeys?.includes(component?.dataMap)
    ? actualData?.find((d) => d.name === component?.dataMap)
    : null;

  const statsPiechartData = chartStatsData?.data?.map((d) => ({
    ...d,
    label: d.id,
    value: d.count,
  }));

  return (
    <PieChart
      title={component?.title}
      chart={{
        series: statsPiechartData,
      }}
    />
  );
};

export default PieChartWrapper;
