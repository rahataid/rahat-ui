// import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
// import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
// import { useTriggerCommunication } from '@rahat-ui/query';
// import { UUID } from 'crypto';
// import { SessionStatus } from '@rumsan/connect/src/types/index';
// import SpinnerLoader from '../../../components/spinner.loader';
// import { Download } from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CommunicationCard } from '../components/communicationCard';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { useMemo } from 'react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type CommunicationData = {
  groupId: string;
  groupType: string;
  transportId: string;
  message: string | { fileName: string; mediaURL: string };
  communicationId: string;
  transportName: string;
  sessionStatus: string;
};

type CommunicationList = {
  activityCommunication: any[];
  loading?: boolean;
};

export default function CommunicationList({
  activityCommunication,
  loading,
}: CommunicationList) {
  const defaultTab = useMemo(() => {
    const active = activityCommunication?.some(
      (d) => d.sessionStatus === 'NEW' || d.sessionStatus === 'PENDING',
    );
    return active ? 'communications' : 'history';
  }, [activityCommunication]);

  const pendingCommunications = useMemo(() => {
    return activityCommunication?.filter(
      (d) => d?.sessionStatus === 'NEW' || d?.sessionStatus === 'PENDING',
    );
  }, [activityCommunication]);

  const completedCommunications = useMemo(() => {
    return activityCommunication?.filter(
      (d) => d?.sessionStatus === 'COMPLETED',
    );
  }, [activityCommunication]);

  const { activeTab, setActiveTab } = useActiveTab(defaultTab);
  return (
    <div className="border px-4 pt-2 rounded-xl ">
      <div className="mb-4 flex items-center justify-between ">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Communication List
          </h1>{' '}
          <p className="text-sm text-gray-500">
            List of communications in this activity
          </p>
        </div>
        {/* <div className="flex mt-5">
          <IconLabelBtn
            Icon={Plus}
            handleClick={() => console.log('add')}
            name="Add Commuication"
            className="h-7  text-sm"
          />
        </div> */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 rounded-sm">
          <TabsTrigger
            value="communications"
            className="data-[state=active]:bg-white flex items-center gap-2"
          >
            Communications
            <Badge
              className={`h-5 w-5 justify-center text-white px-2 py-0 ${
                activeTab === 'communications' ? 'bg-blue-500 ' : 'bg-gray-500'
              }`}
            >
              {pendingCommunications?.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white flex items-center gap-2"
          >
            History
            <Badge
              className={`h-5 w-5 justify-center text-white px-2 py-0 ${
                activeTab === 'history' ? 'bg-blue-500 ' : 'bg-gray-500'
              }`}
            >
              {completedCommunications?.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communications">
          {loading && <SpinnerLoader />}
          <div className="overflow-y-auto  scrollbar-hidden xl:h-[calc(100vh-320px)] h-[calc(100vh-200px)]   ">
            {pendingCommunications?.length === 0 && !loading ? (
              <NoResult message="No Communication Available" />
            ) : (
              pendingCommunications?.map((comm, index) => (
                <CommunicationCard key={index} activityCommunication={comm} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          {loading && <SpinnerLoader />}
          <div className="overflow-y-auto  scrollbar-hidden xl:h-[calc(100vh-320px)]  h-[calc(100vh-200px)]  ">
            {completedCommunications?.length === 0 && !loading ? (
              <NoResult message="No History Available" />
            ) : (
              completedCommunications?.map((comm, index) => (
                <CommunicationCard key={index} activityCommunication={comm} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
