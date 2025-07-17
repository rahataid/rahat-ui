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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';

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
  const { activeTab, setActiveTab } = useActiveTab('overview');
  return (
    <div className=" flex flex-col p-4">
      <Heading
        title="Communications Logs"
        description="Track all the communication logs here"
      />

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="items-center"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="communicationLog">Communication Log</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {isLoadingCommsStats && isLoadingBenefStakeholdersStats ? (
            <CommunicationsStatsSkeleton />
          ) : (
            <CommunicationsChartsStats
              commsStatsData={commsStatsData}
              statsBenefStakeholders={data}
            />
          )}
        </TabsContent>
        <TabsContent value="communicationLog">
          <CommsActivitiesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
