import { ChartDonut } from '@rahat-ui/shadcn/charts';

type IProps = {
  donutData: any;
  totalBeneficiaries?: number;
  title?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
};
const Donut = ({
  donutData,
  totalBeneficiaries,
  title,
  height,
  width,
  className,
}: IProps) => {
  const k = donutData?.data?.map((f) => f?.count);
  const sumSeries = k?.reduce((a: number, b: number) => a + b, 0);
  return (
    <div className={`bg-card shadow rounded p-6 mt-2 w-full ${className}`}>
      <h2 className="text-lg font-2xl text-left ">{title}</h2>

      <h3 className="text-3xl font-bold text-left">
        {totalBeneficiaries && (sumSeries || 0)}
        {/* {sumSeries} */}
      </h3>
      <div className={`flex justify-center ${!totalBeneficiaries && 'mt-8'}`}>
        <ChartDonut
          donutSize="75%"
          labels={
            donutData?.data?.length > 0
              ? donutData?.data?.map((f) => f?.id)
              : ['NO DATA']
          }
          series={
            donutData?.data?.length > 0
              ? donutData?.data?.map((f) => f?.count)
              : [0]
          }
          height={height}
          width={width}
        />
      </div>
    </div>
  );
};

export default Donut;
