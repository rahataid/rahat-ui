import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';

type DonutData = {
  component: any;
  source: any;
  actualData: any;
};

const DonutWrapper = ({ actualData, component, source }: DonutData) => {
  const chartStatsData = actualData?.find((d) => d.name === component?.dataMap);

  const statsDonutData = chartStatsData?.data?.map((d) => ({
    ...d,
    label: d.id,
    value: d.count,
  }));
  console.log('statsDonutData', statsDonutData);

  if (statsDonutData)
    return (
      <ChartDonut
        series={statsDonutData.map((i) => i.count)}
        labels={statsDonutData.map((l) => l.label)}
      />
    );
};

export default DonutWrapper;
