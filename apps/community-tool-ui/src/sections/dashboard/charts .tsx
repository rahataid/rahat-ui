import { PieChart } from '@rahat-ui/shadcn/charts';
import { DashboardRecentActivities } from './activities.dashboard';
import { formatUnderScoredString } from 'apps/rahat-ui/src/utils/string';

const Charts = ({ charts }: { charts: any }) => {
  return (
    <div className=" grid md:grid-cols-3 gap-2 mt-2">
      {charts?.map((d: any) => {
        const series = Array.isArray(d?.data)
          ? d?.data.map((item: any) => ({
              label: formatUnderScoredString(item.id),
              value: item.count,
            }))
          : [
              {
                label: formatUnderScoredString(d.name),
                value: d?.data?.count,
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

      <DashboardRecentActivities title="Recent Activities" />
    </div>
  );
};

export default Charts;
