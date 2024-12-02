import { LineChart } from '@rahat-ui/shadcn/src/components/charts';

type LineChartData = {
  component: any;
  actualData: any;
};

const LineChartWrapper = ({ actualData, component }: LineChartData) => {
  const lineChartStatsData = actualData?.find(
    (d: any) => d.name === component?.dataMap,
  );

  const series = lineChartStatsData?.data?.map((d: any) => ({
    name: d?.id,
    data: d?.data,
  }));

  const flatSeries = [
    {
      name: component?.title,
      data: series?.flatMap((s: any) => s?.data),
    },
  ];
  const flatCategories = series?.flatMap((d: any) => d?.name);

  if (lineChartStatsData)
    return (
      <div className="rounded-md bg-card p-4 shadow border">
        <h1 className="text-md font-medium mb-4">{component?.title}</h1>
        {/* eg: */}
        {/* For the line charts to work properly database should have this data structure store
            [{"id":"week42","data":[1]},{"id":"week43","data":[2]}]  
      */}

        {/* <LineChart
          series={[
            { name: 'Laptop', data: [4, 11, 3, 17] },
            { name: 'Reading Glass', data: [5, 7, 9, 11] },
          ]}
          categories={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
        /> */}
        <LineChart series={flatSeries} categories={flatCategories} />
      </div>
    );
};

export default LineChartWrapper;
