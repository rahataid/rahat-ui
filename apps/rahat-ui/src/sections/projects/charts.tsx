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
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
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
          title="Phone Status"
          subheader="Total number of phone status in the system."
          chart={{
            series: chartData3,
          }}
        />
      )}
    </div>
  );
};

export default Charts;
