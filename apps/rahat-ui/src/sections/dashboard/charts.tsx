import { PieChart } from '@rahat-ui/shadcn/charts';
import { formatUnderScoredString } from '../../utils/string';

const Charts = ({ charts }: { charts: any }) => {
  const filteredCharts = charts?.filter((d: any) => {
    return (
      d.name === 'BENEFICIARY_AGE_RANGE' || d.name === 'BENEFICIARY_GENDER'
    );
  });

  return (
    <div className=" grid md:grid-cols-2 gap-2 mt-2 mb-2">
      {filteredCharts?.map((d: any) => {
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
    </div>
  );
};

export default Charts;
