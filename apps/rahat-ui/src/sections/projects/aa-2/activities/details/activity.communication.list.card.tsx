import React from 'react';
// import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
// import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
// import { useTriggerCommunication } from '@rahat-ui/query';
// import { UUID } from 'crypto';
// import { SessionStatus } from '@rumsan/connect/src/types/index';
// import SpinnerLoader from '../../../components/spinner.loader';
// import { Download } from 'lucide-react';

import { CommunicationCard } from '../components/communicationCard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';

// type IProps = {
//   activityDetail: any;
//   projectId: string | string[];
// };

// export default function ActivityCommunicationListCard({
//   activityDetail,
//   projectId,
// }: IProps) {
//   const [loadingButtons, setLoadingButtons] = React.useState<string[]>([]);

//   const activityId = activityDetail.uuid;

//   const trigger = useTriggerCommunication();

//   const triggerCommunication = async (
//     activityId: string,
//     communicationId: string,
//   ) => {
//     setLoadingButtons((prev) => [...prev, communicationId]);
//     try {
//       await trigger.mutateAsync({
//         projectUUID: projectId as UUID,
//         activityCommunicationPayload: { communicationId, activityId },
//       });
//     } finally {
//       setLoadingButtons((prev) => prev.filter((id) => id !== communicationId));
//     }
//   };

//   console.log(activityDetail?.activityCommunication)

//   return (
//     <div className="bg-card p-4 rounded">
//       <h1 className="font-semibold text-lg">Communication List</h1>
//       {activityDetail?.activityCommunication?.length ? (
//         <ScrollArea className="h-[calc(100vh-310px)]">
//           {activityDetail?.activityCommunication?.map((comm: any) => (
//             <div key={comm?.id} className="p-4 rounded-md bg-secondary mt-4">
//               <div className="flex justify-between items-center">
//                 <h1 className="font-medium text-primary">{comm?.groupName}</h1>
//                 <Button
//                   type="button"
//                   disabled={comm?.sessionStatus !== SessionStatus.NEW}
//                   className="h-7 w-24"
//                   onClick={() =>
//                     triggerCommunication(activityId, comm?.communicationId)
//                   }
//                 >
//                   {loadingButtons.includes(comm?.communicationId) ? (
//                     <SpinnerLoader />
//                   ) : comm?.sessionStatus === SessionStatus.NEW ? (
//                     'Send'
//                   ) : (
//                     'Sent'
//                   )}
//                 </Button>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <h1 className="text-muted-foreground text-sm">Group Type</h1>
//                   <p>{comm?.groupType}</p>
//                 </div>
//                 <div className="text-right">
//                   <h1 className="text-muted-foreground text-sm">
//                     Communication
//                   </h1>
//                   <p>{comm?.transportName}</p>
//                 </div>
//                 <div>
//                   <h1 className="text-muted-foreground text-sm">Message</h1>
//                   <p>{renderMessage(comm?.message)}</p>
//                 </div>
//                 <div className="text-right">
//                   <h1 className="text-muted-foreground text-sm">Status</h1>
//                   <Badge className="bg-orange-100 text-orange-600">
//                     {comm?.sessionStatus}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </ScrollArea>
//       ) : (
//         <p className="text-muted-foreground text-sm">No Communication</p>
//       )}
//     </div>
//   );
// }

// function renderMessage(message: any) {
//   if (typeof message === 'string') {
//     return message;
//   }
//   return (
//     <a
//       className="cursor-pointer underline inline-flex"
//       href={message?.mediaURL}
//       target="_blank"
//     >
//       <span>{message?.fileName}</span>
//       <Download size={20} strokeWidth={1.5} className="ml-2" />
//     </a>
//   );
// }

// import { CommunicationCard } from '@/components/communication-card';

export default function CommunicationList() {
  const communications = [
    {
      groupName: 'Stakeholders Group Name',
      type: 'SMS' as const,
      stakeholders: 'Stakeholders',
      status: 'Pending' as const,
      message:
        'As part of the Anticipatory Action project, we would like to inform you about an upcoming meeting on disaster preparedness.',
    },
    {
      groupName: 'Stakeholders Group Name2',
      type: 'SMS' as const,
      stakeholders: 'Stakeholders',
      status: 'Sent' as const,
      message:
        'As part of the Anticipatory Action project, we would like to inform you about an upcoming meeting on disaster preparedness.',
    },
    {
      groupName: 'Stakeholders Group Name',
      type: 'Email' as const,
      stakeholders: 'Stakeholders',
      status: 'Pending' as const,
      message:
        'As part of the Anticipatory Action project, we would like to inform you about an upcoming meeting on disaster preparedness.',
    },
    {
      groupName: 'Stakeholders Group Name',
      type: 'IVR' as const,
      stakeholders: 'Stakeholders',
      status: 'Pending' as const,
      audioSrc: '/audio.mp3',
    },
  ];

  return (
    <div className="border px-4 pt-2 rounded-xl">
      <div className="mb-4 flex items-center justify-between ">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Communication List
          </h1>
          <p className="text-sm text-gray-500">
            List of communications in this activity
          </p>
        </div>
        <div className="flex mt-5">
          <IconLabelBtn
            Icon={Plus}
            handleClick={() => console.log('add')}
            name="Add Commuication"
            className="h-7  text-sm"
          />
        </div>
      </div>

      <Tabs defaultValue={'communications'}>
        <TabsList>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="communications">
          <ScrollArea className="overflow-y-auto h-[calc(100vh-330px)] ">
            {communications
              ?.filter((d) => d.status === 'Pending')
              .map((comm, index) => (
                <CommunicationCard
                  key={index}
                  groupName={comm.groupName}
                  type={comm.type}
                  stakeholders={comm.stakeholders}
                  status={comm.status}
                  message={comm.message}
                  audioSrc={comm.audioSrc}
                  onEdit={() => console.log('Edit communication', index)}
                  onSend={() => console.log('Send communication', index)}
                />
              ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history">
          {communications
            ?.filter((d) => d.status === 'Sent')
            .map((comm, index) => (
              <CommunicationCard
                key={index}
                groupName={comm.groupName}
                type={comm.type}
                stakeholders={comm.stakeholders}
                status={comm.status}
                message={comm.message}
                audioSrc={comm.audioSrc}
                onEdit={() => console.log('Edit communication', index)}
                onSend={() => console.log('Send communication', index)}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
