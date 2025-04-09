import { LineChart } from '@rahat-ui/shadcn/src/components/charts';
import { WeekRanges } from '../../constants/weekRanges.const';

type LineChartData = {
  series: any[];
  categories: any[];
  name: string;
};

const CambodiaLineCharts = ({ series, categories, name }: LineChartData) => {
  const mappedRanges = categories.map((week) => WeekRanges[week]);
  return (
    <>
      <div className="rounded-md bg-card  p-4 pb-10 shadow border h-72">
        <h1 className="text-md font-medium mb-4">{name}</h1>

        {/* <LineChart
          series={[
            { name: 'Laptop', data: [4, 11, 3, 17] },
            { name: 'Reading Glass', data: [5, 7, 9, 11] },
          ]}
          categories={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
        /> */}
        <LineChart
          series={[{ name: name, data: series }]}
          categories={mappedRanges}
        />
      </div>
    </>
  );
};

export default CambodiaLineCharts;
