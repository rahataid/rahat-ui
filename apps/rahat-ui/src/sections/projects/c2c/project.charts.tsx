import {
  PROJECT_SETTINGS_KEYS,
  useFindAllC2cStats,
  useGetBeneficiaryStats,
  useGetProjectBeneficiaryStats,
  useProjectSettingsStore,
  useRecentTransactionsList,
} from '@rahat-ui/query';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { useParams } from 'next/navigation';
import RecentTransaction from './fundManagement/recent.transaction';
import { UUID } from 'crypto';

type IStats = {
  id: string;
  count: number;
};

const ProjectCharts = () => {
  const { id } = useParams();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const c2cProjectAddress = contractSettings?.c2cproject?.address;
  const { data: transactionList, isLoading: isFetchingTransactionList } =
    useRecentTransactionsList(c2cProjectAddress);
  const { data } = useGetProjectBeneficiaryStats(id as UUID);
  const { data: projectStats } = useFindAllC2cStats(id as UUID);
  console.log(data, projectStats);
  const genderSeries = data?.data
    ?.find((stats: any) => stats.name === `BENEFICIARY_GENDER_ID_${id}`)
    ?.data?.map((gender: IStats) => ({
      label: gender.id,
      value: gender.count,
    }));

  const ageSeries = data?.data
    ?.find((stats: any) => stats.name === `BENEFICIARY_AGE_RANGE_ID_${id}`)
    ?.data?.map((age: IStats) => ({
      label: age.id,
      value: age.count,
    }));

  const disbursementSeries = projectStats
    ?.find((stats: any) => stats.name === 'DISBURSEMENT_TOTAL')
    ?.data?.map((disbursement: IStats) => ({
      label: disbursement.id,
      value: disbursement.count,
    }));

  return (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <PieChart
        title="Gender"
        subheader="Project Stats"
        chart={{
          series: genderSeries || [],
        }}
      />
      <PieChart
        title="Age"
        subheader="Project Stats"
        chart={{
          series: ageSeries || [],
        }}
      />
      {/* <div className="row-span-2">
        <RecentTransaction transactions={transactionList} />
      </div> */}
      <div className="col-span-2">
        <PieChart
          title="Disburse Methods"
          subheader="Project Stats"
          chart={{
            series: disbursementSeries || [],
          }}
        />
      </div>
    </div>
  );
};

export default ProjectCharts;
