import { PieChart } from '@rahat-ui/shadcn/charts';
import { formatUnderScoredString } from '../../utils/string';
import { FC } from 'react';

type ChartData = {
  chartData: any;
};

const Charts: FC<ChartData> = ({ chartData = [] }) => {
  // const { beneficiaryQuery } = useRumsanService();
  // const { data, isLoading } = beneficiaryQuery.useBeneficiaryStats();

  // if (isLoading) return null;

  return (
    <div className="grid md:grid-cols-3 gap-2 mt-2">
      {chartData?.map((d: any) => {
        const series = Array.isArray(d?.data)
          ? d?.data.map((item: any) => ({
              label: formatUnderScoredString(item.id),
              value: item.count,
            }))
          : [{ label: formatUnderScoredString(d.name), value: d?.data?.count }];
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
