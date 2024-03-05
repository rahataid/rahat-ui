import { PieChart } from '@rahat-ui/shadcn/charts';
import { DashboardRecentActivities } from './activities.dashboard';

const Charts = () => {
  return (
    <div className=" grid md:grid-cols-3 gap-4 mt-4">
      <PieChart
        title="Beneficiaries"
        subheader="Total number of beneficiaries in the system."
        chart={{
          colors: ['#FFC107', '#FF7043', '#FFC107', '#FF7043'],
          options: {
            theme: {
              mode: 'light',
              palette: 'palette1',
            },
          },
          series: [
            { label: 'Banked', value: 12244 },
            { label: 'Unbanked', value: 53345 },
          ],
        }}
      />
      <PieChart
        title="Phone Status"
        subheader="Total number of phone status in the system."
        chart={{
          colors: ['#FFC107', '#FF7043', '#FFC107', '#FF7043'],
          series: [
            { label: 'Banked', value: 12244 },
            { label: 'Unbanked', value: 53345 },
          ],
        }}
      />{' '}
      <DashboardRecentActivities title="Recent Activities" />
    </div>
  );
};

export default Charts;
