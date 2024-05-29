import { BarChart } from '@rahat-ui/shadcn/charts';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';

type IProps = {
  charts: any;
  width?: number | string;
  height?: number | string;
  overFlowProps?: boolean;
  title?: string;
  horizontal?: boolean;
};

const BarCharts = ({
  charts,
  width,
  height,
  overFlowProps,
  title,
  horizontal,
}: IProps) => {
  const [categories, series] = charts?.data
    ? [
        charts.data.map((item: any) => item.id),
        charts.data.map((item: any) => item.count),
      ]
    : [[], []];

  const sumSeries = series.reduce((a: number, b: number) => a + b, 0);
  return (
    <div className={`bg-card p-4 rounded `}>
      <h1 className=" text-lg mt-2 mb-1 ml-4 text-primary">{title}</h1>
      {overFlowProps && (
        <h1 className=" text-2xl font-semibold mt-2 mb-1 ml-4 text-primary">
          {sumSeries}
        </h1>
      )}
      <Separator />
      <div
        className={`${
          overFlowProps
            ? 'overflow-x-hidden overflow-y-auto scroll-m-0 h-[calc(100vh-550px)] no-scrollbar'
            : ''
        }`}
      >
        <BarChart
          key={charts.name}
          series={series}
          categories={categories}
          height={height}
          width={width}
          horizontal={horizontal}
        />
      </div>
    </div>
  );
};

export default BarCharts;
