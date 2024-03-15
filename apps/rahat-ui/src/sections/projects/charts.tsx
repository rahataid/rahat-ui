import { PieChart } from '@rahat-ui/shadcn/charts';

const Charts = () => {
  const chartData1 = [
    { label: 'Male', value: 12244 },
    { label: 'Female', value: 53345 },
    { label: 'Other', value: 345 },
  ];

  const chartData2 = [
    { label: 'Banked', value: 12244 },
    { label: 'Unbanked', value: 53345 },
  ];

  const chartData3 = [
    { label: 'No_Phone', value: 2244 },
    { label: 'Smart_Phone', value: 3345 },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-2 mt-2">
      {chartData1.length && (
        <PieChart
          title="Gender-wise Distribution"
          subheader="Total number of peoples in the system."
          chart={{
            series: chartData1,
          }}
        />
      )}
      {chartData2.length && (
        <PieChart
          title="Beneficiaries"
          subheader="Total number of beneficiaries in the system."
          chart={{
            series: chartData2,
          }}
        />
      )}
      {chartData3.length && (
        <PieChart
          title="Voucher redemption"
          subheader="Total number of voucher redemption in the system."
          chart={{
            series: chartData3,
          }}
        />
      )}
    </div>
  );
};

export default Charts;
