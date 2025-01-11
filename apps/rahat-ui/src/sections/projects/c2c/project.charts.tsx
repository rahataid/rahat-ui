import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useRecentTransactionsList,
} from '@rahat-ui/query';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { useParams } from 'next/navigation';
import RecentTransaction from './fundManagement/recent.transaction';

const ProjectCharts = () => {
  const { id } = useParams();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const c2cProjectAddress = contractSettings?.c2cproject?.address;
  const { data: transactionList, isLoading: isFetchingTransactionList } =
    useRecentTransactionsList(c2cProjectAddress);
  return (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <PieChart
        title="Gender"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Male', value: 50 },
            { label: 'Female', value: 10 },
          ],
        }}
      />
      <PieChart
        title="Age"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Under 18', value: 20 },
            { label: '18-24', value: 30 },
            { label: '25+', value: 50 },
          ],
        }}
      />
      <div className="row-span-2">
        <RecentTransaction transactions={transactionList} />
      </div>
      <div className="col-span-2">
        <PieChart
          title="Disburse Methods"
          subheader="Project Stats"
          chart={{
            series: [
              { label: 'Project', value: 40 },
              { label: 'EOA', value: 60 },
              { label: 'MULTISIG', value: 50 },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default ProjectCharts;
