import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type BarChartData = {
  component: any;
  actualData: any;
};

const BarChartWrapper = ({ actualData, component }: BarChartData) => {
  const barData = actualData?.find((d: any) => d.name === component?.dataMap);

  const categories = barData?.data.map((b: any) => b.id);
  const series = barData?.data.map((b: any) => b.count);

  if (categories && series)
    return (
      <div className="bg-card rounded-sm p-4 shadow-md">
        <p className="text-md font-medium mb-4">{component?.title}</p>
        <ScrollArea className="h-[288px]">
          <div className="flex justify-center">
            <BarChart
              categories={categories}
              series={series}
              xaxisLabels={component?.props?.xaxisLabels}
              horizontal={component?.props?.horizontal}
            />
          </div>
        </ScrollArea>
      </div>
    );
};

export default BarChartWrapper;
