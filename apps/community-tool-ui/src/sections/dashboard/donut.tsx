import { ChartDonut } from '@rahat-ui/shadcn/charts';

type IProps = {
  donutData: any;
  totalBeneficiaries?: number;
  title?: string;
  height?: number | string;
  width?: number | string;
};
const Donut = ({
  donutData,
  totalBeneficiaries,
  title,
  height,
  width,
}: IProps) => {
  return (
    <div className="bg-card shadow rounded p-6 mt-2 w-full">
      <h2 className="text-lg font-medium text-left text-primary">{title}</h2>

      <p className="text-3xl font-bold text-left text-primary">
        {totalBeneficiaries}
      </p>
      <div className="flex justify-center">
        {donutData && (
          <ChartDonut
            donutSize="75%"
            labels={donutData?.data?.map((f) => f?.id)}
            series={donutData?.data?.map((f) => f?.count)}
            height={height}
            width={width}
          />
        )}
      </div>
    </div>
  );
};

export default Donut;
