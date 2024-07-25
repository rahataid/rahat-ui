import { PieChart } from '@rahat-ui/shadcn/src/components/charts';

type PiechartData = {
  component: any;
  source: any;
  actualData: any;
};

const PieChartWrapper = ({ actualData, component, source }: PiechartData) => {
  const chartStatsData = actualData?.find((d) => d.name === component?.dataMap);

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
