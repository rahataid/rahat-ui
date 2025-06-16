import { PieChart } from '@rahat-ui/shadcn/src/components/charts';

type IProps = {
  title: string;
  series: Array<{ label: string; value: number }>;
  colors: Array<string>;
  style?: string;
};

export default function PieChartCard({ title, series, colors, style }: IProps) {
  return (
    <div className={`rounded-sm bg-card p-4 ${style ? style : 'shadow-md'}`}>
      <h1 className="text-md font-medium mb-4">{title}</h1>
      <div className="flex justify-center">
        <PieChart
          chart={{
            series: series,
            colors: colors,
          }}
          width={300}
          height={250}
          custom={true}
        />
      </div>
    </div>
  );
}
