import { PieChart } from '@rahat-ui/shadcn/charts';
import { formatUnderScoredString } from 'apps/rahat-ui/src/utils/string';

const Charts = ({ charts }: { charts: any }) => {
  const validCharts = charts?.filter((chart: any) => {
    return Array.isArray(chart.data)
      ? chart.data.length > 0
      : chart.data.count > 0;
  });

  return (
    <div className=" grid md:grid-cols-3 gap-2 mt-2">
      {validCharts?.map((d: any) => {
        const series = Array.isArray(d?.data)
          ? d?.data.map((item: any) => ({
              label: formatUnderScoredString(item.id),
              value: item?.count || 0,
            }))
          : [
              {
                label: formatUnderScoredString(d.name),
                value: d?.data?.count || 0,
              },
            ];
        return (
          <PieChart
            key={d.name}
            title={formatUnderScoredString(d.name)}
            subheader={d.subheader || ''}
            chart={{ series }}
          />
        );
      })}

      {/* <DashboardRecentActivities title="Recent Activities" /> */}
    </div>
  );
};

export default Charts;
