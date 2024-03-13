import { PieChart } from '@rahat-ui/shadcn/charts';
import { DashboardRecentActivities } from './activities.dashboard';

const Charts = () => {
  const chartData1 = [
    { label: 'Banked', value: 12244 },
    { label: 'Unbanked', value: 53345 },
  ];

  const chartData2 = [
    { label: 'Banked', value: 12244 },
    { label: 'Unbanked', value: 53345 },
  ];
  return (
    <div className=" grid md:grid-cols-3 gap-4 mt-4">
      {chartData1.length && (
        <PieChart
          title="Beneficiaries"
          subheader="Total number of beneficiaries in the system."
          chart={{
            series: chartData1,
          }}
        />
      )}
      {chartData2.length && (
        <PieChart
          title="Phone Status"
          subheader="Total number of phone status in the system."
          chart={{
            series: chartData2,
          }}
        />
      )}{' '}
      <DashboardRecentActivities title="Recent Activities" />
    </div>
  );
};

export default Charts;
