import { BarChart } from '@rahat-ui/shadcn/charts';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';

type IProps = {
  charts: any;
  width?: number | string;
  height?: number | string;
  overFlowProps?: boolean;
  title?: string;
  horizontal?: boolean;
  className?: string;
  colors?: string[];
};

const BarCharts = ({
  charts,
  width,
  height,
  overFlowProps,
  title,
  horizontal,
  className,
  colors,
}: IProps) => {
  const [ctCategories, ctSeries] = charts?.data
    ? [
        charts.data.map((item: any) => item.id),
        charts.data.map((item: any) => item.count),
      ]
    : [[], []];

  const sumSeries = ctSeries.reduce((a: number, b: number) => a + b, 0);

  const dynamicHeight = horizontal ? ctCategories.length * 30 + 150 : height;
  return (
    <div className={`bg-card shadow-md p-4 rounded-lg  mt-2 ${className} `}>
      <h1 className=" text-lg font-medium mt-2 mb-1 ml-4 ">{title}</h1>
      {overFlowProps && (
        <h1 className=" text-2xl text-blue-500 font-semibold mt-2 mb-1 ml-4 ">
          {sumSeries}
        </h1>
      )}
      <Separator />
      <div
        className={`${
          overFlowProps
            ? 'overflow-y-auto scroll-m-0 h-[250px] no-scrollbar'
            : ''
        }`}
      >
        <BarChart
          key={charts.name}
          ctSeries={ctSeries}
          ctCategories={ctCategories}
          height={dynamicHeight}
          width={width}
          horizontal={horizontal}
          colors={colors}
          communityTool={true}
        />
      </div>
    </div>
  );
};

export default BarCharts;
