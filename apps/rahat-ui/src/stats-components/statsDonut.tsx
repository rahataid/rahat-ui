import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';

type Props = {
  title: string;
  subtitle? : string;
  labels: string[];
  values: number[];
  size?: string;
};

export default function StatsDonut({
  title,
  subtitle,
  labels,
  values,
  size="80%"
}: Props) {
  return (
    <>
      <div key={title} className="bg-card shadow p-5 rounded w-full">
        <h1 className="font-semibold mb-1">{title}</h1>
        <p className="text-muted-foreground text-sm mb-3">{subtitle}</p>
        <div className="flex justify-center">
          <ChartDonut
            labels={labels}
            series={values}
            donutSize={size}
          />
        </div>
      </div>
    </>
  )
}
