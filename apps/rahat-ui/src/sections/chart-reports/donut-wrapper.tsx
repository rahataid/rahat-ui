import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { humanizeString } from '../../utils';

type DonutData = {
  component: any;
  source: any;
  actualData: any;
};

const DonutWrapper = ({ actualData, component, source }: DonutData) => {
  const chartStatsData = actualData?.find(
    (d: any) => d.name === component?.dataMap,
  );

  const statsDonutData = chartStatsData?.data?.map((d: any) => ({
    ...d,
    label: d.id,
    value: d.count,
  }));
  console.log('statsDonutData', statsDonutData);

  if (statsDonutData?.length > 0)
    return (
      <div className="bg-card border rounded-sm p-4 shadow-md">
        <p className="text-md font-medium mb-4">{component?.title}</p>
        <div className="flex justify-center">
          <ChartDonut
            series={statsDonutData.map((i: any) => i.count)}
            labels={statsDonutData.map((l: any) =>
              humanizeString(
                l.label === 'SINGLE_VISION' ? 'Ready to Clip (R2C)' : l.label,
              ),
            )}
            donutSize="70%"
            width={400}
            height={320}
          />
        </div>
      </div>
    );
};

export default DonutWrapper;
