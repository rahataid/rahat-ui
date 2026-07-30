import { useTranslations } from 'next-intl';
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
import { IndividualLogTab } from './components/IndividualLogs';

export default function CommunicationMainLogsView() {
  const t = useTranslations('AA_PROJECT');
  const { id: ProjectId } = useParams();
  const { data: commsStatsData, isLoading: isLoadingCommsStats } =
    useCommsStats(ProjectId as UUID);
  const { data, isLoading: isLoadingBenefStakeholdersStats } =
    useCommuicationStatsforBeneficiaryandStakeHolders(ProjectId as UUID);
  const { activeTab, setActiveTab } = useActiveTab('overview');
  return (
    <div className="flex flex-col p-4">
      <Heading
        title={t('COMMUNICATIONS_LOGS')}
        description={t('TRACK_ALL_THE_ACTIVITY_BASED_LOGS')}
      />

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="items-center"
      >
        <TabsList className="grid grid-cols-3 gap-1.5 w-[414px] h-[40px] bg-[#F0F1F3] rounded-md p-1">
          <TabsTrigger
            value="overview"
            className={`${
              activeTab === 'overview'
                ? 'bg-white no-underline text-black'
                : 'text-black'
            } h-full w-full p-1 font-inter text-[14px] leading-[24px] tracking-[0%]`}
          >
            {t('OVERVIEW')}
          </TabsTrigger>
          <TabsTrigger
            value="communicationLog"
            className={`${
              activeTab === 'communicationLog'
                ? 'bg-white no-underline text-black'
                : 'text-black'
            } h-full w-full p-1 font-inter text-[14px] leading-[24px] tracking-[0%]`}
          >
            {t('ACTIVITY_BASED_LOG')}
          </TabsTrigger>
          <TabsTrigger
            value="individualLog"
            className={`${
              activeTab === 'individualLog'
                ? 'bg-white no-underline text-black'
                : 'text-black'
            } h-full w-full p-1 font-inter text-[14px] leading-[24px] tracking-[0%]`}
          >
            {t('INDIVIDUAL_LOGS')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {isLoadingCommsStats || isLoadingBenefStakeholdersStats ? (
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
        <TabsContent value="individualLog">
          <IndividualLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
