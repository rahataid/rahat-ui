import { useSingleActivity } from "@rahat-ui/query";
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { ScrollArea } from "@rahat-ui/shadcn/src/components/ui/scroll-area";
import { UUID } from "crypto";
import { Download, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import Loader from 'apps/rahat-ui/src/components/table.loader';
import { Badge } from "@rahat-ui/shadcn/src/components/ui/badge";
import { SessionStatus } from "@rumsan/connect/src/types";

type IProps = {
  activityId: any
};

function renderMessage(message: any) {
  if (typeof (message) === "string") {
    return `${message.substring(0, 35)}...`;
  }
  return (
    <a className='cursor-pointer underline inline-flex' href={message?.mediaURL} target='_blank'>
      <span>
        {message?.fileName}
      </span>
      <Download size={20} strokeWidth={1.5} className='ml-2' />
    </a>
  )
}

const CommunicationDetailCard = ({ comm }: any) => {
  console.log(comm)
  return (
    <div key={comm?.communicationId} className="p-4 rounded-md bg-secondary mt-4">
      <div className="flex justify-between items-center">
        <h1 className="font-medium text-primary">{comm?.groupName}</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h1 className="text-muted-foreground text-sm">Group Type</h1>
          <p>{comm?.groupType}</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">
            Communication
          </h1>
          <p>{comm?.transportName}</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Message</h1>
          <p>{renderMessage(comm?.message)}</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">Status</h1>
          <Badge className="bg-orange-100 text-orange-600">
            {comm?.sessionStatus}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center space-x-2 mt-2">
        <Button disabled={comm?.sessionStatus === SessionStatus.NEW} type="button" variant='secondary' className="w-full bg-[#E1ECF9] hover:bg-[#bbd5f4] text-primary"><Eye className="mr-2" size={16} strokeWidth={2} /><span className="font-normal">View</span></Button>
        <Button disabled={true} type="button" className="w-full"><Download className="mr-2" size={16} strokeWidth={2} /><span className="font-normal">Failed Exports</span></Button>
      </div>
    </div>
  )
}

export default function ActivityCommsCards({ activityId }: IProps) {
  const params = useParams();
  const projectId = params.id as UUID;
  const { data: activityDetail, isLoading } = useSingleActivity(
    projectId,
    activityId,
  );

  if (isLoading) {
    return <Loader />
  }

  console.log(activityDetail)

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-2">
        {activityDetail?.activityCommunication?.map((comm: any, index: number) => (
          <CommunicationDetailCard key={index} comm={comm} />
        ))}
      </div>
    </ScrollArea>
  );
}
