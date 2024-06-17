import { PieChart } from '@rahat-ui/shadcn/charts';
import { formatUnderScoredString } from 'apps/rahat-ui/src/utils/string';

const titleMappings = [
  'Household by Caste',
  'Type of Phone',
  'Household Bank Status',
  'Household Phone Availability',
];
const Charts = ({ charts }: { charts: any }) => {
  return (
    <div className="grid  sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-2  ">
      {charts &&
        charts.length > 0 &&
        charts.map((d: any, index: number) => {
          const series =
            Array.isArray(d?.data) && d.data.length
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
              title={titleMappings[index]}
              subheader={d.subheader || ''}
              chart={{
                series,
                colors: ['#4CAF50', '#E0CA52', '#297AD7', '#E052BC'],
              }}
              communityTool={true}
              donutSize="10%"
            />
          );
        })}
    </div>
  );
};

export default Charts;
