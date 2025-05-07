import { LineChart } from '@rahat-ui/shadcn/src/components/charts';

type LineChartData = {
  series: any[];
  categories: any[];
  name: string;
};

const SmsVoucherLineCharts = ({ series, categories, name }: LineChartData) => {
  return (
    <>
      <div className="rounded-md bg-card shadow border h-[400px]">
        <LineChart
          series={[{ name: name, data: series }]}
          categories={categories}
        />
      </div>
    </>
  );
};

export default SmsVoucherLineCharts;
