import { LineChart } from '@rahat-ui/shadcn/src/components/charts';

type LineChartData = {
  component: any;
  actualData: any;
};

const LineChartWrapper = ({ actualData, component }: LineChartData) => {
  const lineChartStatsData = actualData?.find(
    (d: any) => d.name === component?.dataMap,
  );

  const series = lineChartStatsData?.data?.map((d: any) => ({ name: d.id, data: d.data }))

  if (lineChartStatsData) return (

    <div className="rounded-md bg-card p-4 shadow border">
      <h1 className="text-md font-medium mb-4">{component?.title}</h1>
      {/* eg: */}
      {/* <LineChart series={[{ name: 'Single Vision', data: [4, 11, 3, 17] }, { name: 'Reading Glass', data: [5, 7, 9, 11] }]} categories={['Week 1', 'Week 2', 'Week 3', 'Week 4']} /> */}
      <LineChart
        series={series}
        categories={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
      />
    </div>

  )
};

export default LineChartWrapper;
