import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { extractDataArray } from '../../utils/extractDataArray';

type PiechartData = {
  component: any;
  source: any;
  actualData: any;
};

const PieChartWrapper = ({ actualData, component, source }: PiechartData) => {
  const dataArray = extractDataArray(actualData);

  const chartStatsData = dataArray?.find(
    (d: any) => d.name === component?.dataMap,
  );

  const statsPiechartData = chartStatsData?.data?.map((d: any) => ({
    ...d,
    label: d.id,
    value: d.count,
  }));

  return (
    <div className="rounded-sm bg-card p-4 shadow-md">
      <h1 className="text-md font-medium mb-4">{component?.title}</h1>
      <div className="flex justify-center">
        <PieChart
          chart={{
            series: statsPiechartData,
          }}
          custom={true}
        />
      </div>
    </div>
  );
};

export default PieChartWrapper;
