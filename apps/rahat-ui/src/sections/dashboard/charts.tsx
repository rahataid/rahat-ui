import ChartsCard from 'apps/rahat-ui/src/components/chartsCard';
import { DashboardRecentActivities } from './activities.dashboard';

const charts = () => {
  return (
    <div className=" grid md:grid-cols-3 gap-4 mt-4">
      <ChartsCard title="Beneficiaries" image="/charts.png" />
      <ChartsCard title="Beneficiaries" image="/charts.png" />

      <DashboardRecentActivities title="Recent Activities" />
    </div>
  );
};

export default charts;
