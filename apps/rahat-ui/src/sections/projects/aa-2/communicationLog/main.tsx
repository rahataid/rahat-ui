import {
  useCommsStats,
  useCommuicationStatsforBeneficiaryandStakeHolders,
} from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import CommunicationsChartsStats from './components/commsShartsStats';
import CommunicationsStatsSkeleton from './components/commsSkeleton';
import CommsActivitiesTable from './table/comms.activities.table';

export default function CommunicationMainLogsView() {
  const { id: ProjectId } = useParams();
  const { data: commsStatsData, isLoading: isLoadingCommsStats } =
    useCommsStats(ProjectId as UUID);
  const { data, isLoading: isLoadingBenefStakeholdersStats } =
    useCommuicationStatsforBeneficiaryandStakeHolders(ProjectId as UUID);
  console.log(
    'statsBenefStakeholders',
    commsStatsData,
    isLoadingCommsStats,
    isLoadingBenefStakeholdersStats,
  );
  return (
    <div className=" flex flex-col p-4">
      <Heading
        title="Communications Logs"
        description="Track all the communication logs here"
      />

      {isLoadingCommsStats && isLoadingBenefStakeholdersStats ? (
        <CommunicationsStatsSkeleton />
      ) : (
        <CommunicationsChartsStats
          commsStatsData={commsStatsData}
          statsBenefStakeholders={data}
        />
      )}

      <div className=" mt-4">
        <CommsActivitiesTable />
      </div>
    </div>
  );
}
