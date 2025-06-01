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
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CommunicationCard } from '../components/communicationCard';

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

      <Tabs defaultValue={'communications'}>
        <TabsList>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="communications">
          {loading && <SpinnerLoader />}
          <div className="overflow-y-auto  scrollbar-hidden xl:h-[calc(100vh-320px)] h-[calc(100vh-200px)]   ">
            {activityCommunication
              ?.filter(
                (d) =>
                  d.sessionStatus === 'NEW' || d.sessionStatus === 'PENDING',
              )
              .map((comm, index) => (
                <CommunicationCard key={index} activityCommunication={comm} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          {loading && <SpinnerLoader />}
          <div className="overflow-y-auto  scrollbar-hidden xl:h-[calc(100vh-320px)]  h-[calc(100vh-200px)]  ">
            {activityCommunication
              ?.filter((d) => d.sessionStatus === 'COMPLETED')
              .map((comm, index) => (
                <CommunicationCard key={index} activityCommunication={comm} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
