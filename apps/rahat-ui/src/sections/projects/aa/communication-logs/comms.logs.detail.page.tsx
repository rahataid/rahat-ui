import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Component,
  Download,
  LucideIcon,
  MessageSquareMore,
  Timer,
  UsersRound,
} from 'lucide-react';
import CommsLogsTable from './comms.logs.table';
import { useParams } from 'next/navigation';
import { useGetCommunicationLogs } from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import { TransportType, ValidationContent } from '@rumsan/connect/src/types';

type IHeadCardProps = {
  title: string;
  icon: LucideIcon;
  content: string;
};

export default function CommsLogsDetailPage() {
  const { id: projectID, commsIdXactivityId } = useParams();
  const [communicationId, activityId] = (commsIdXactivityId as string).split('%40');

  const { data: logs, isLoading } = useGetCommunicationLogs(projectID as UUID, communicationId, activityId);

  const headCardFields = [
    {
      title: 'Total Audience',
      icon: UsersRound,
      content: logs?.totalAudience || 'N/A',
    },
    {
      title: 'Triggered At',
      icon: Timer,
      content: renderDateTime(logs?.sessionDetails?.createdAt)
    },
    {
      title: 'Group Name',
      icon: Timer,
      content: logs?.groupName || 'N/A',
    },
    {
      title: 'Group Type',
      icon: Component,
      content: logs?.communicationDetail?.groupType || 'N/A',
    },
  ];

  if (isLoading) {
    return (<Loader />)
  }

  return (
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-xl">Communication Details</h1>
        <Button type="button">
          <Download className="mr-2" size={16} strokeWidth={2} />
          <span className="font-normal">Failed Exports</span>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {headCardFields?.map((d: IHeadCardProps) => {
          const Icon = d?.icon;
          return (
            <div className="bg-card p-4 rounded-sm border">
              <div className="flex justify-between mb-2">
                <h1 className="font-medium text-sm">{d?.title}</h1>
                <Icon
                  className="text-muted-foreground"
                  size={20}
                  strokeWidth={1.5}
                />
              </div>
              {d?.title === 'Group Type' ? (
                <Badge>{d?.content}</Badge>
              ) : (
                <p className="text-primary font-semibold text-xl">
                  {d?.content}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 p-4 border border-primary rounded-sm bg-card">
        <div className="flex justify-between space-x-8">
          <div className="flex space-x-4">
            <div className="h-10 w-10 rounded-full border border-muted-foreground grid place-items-center">
              <MessageSquareMore
                className="text-muted-foreground"
                size={20}
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Message</p>
              <p className="text-muted-foreground text-sm">
                  {logs?.sessionDetails?.Transport?.name}
              </p>
            </div>
          </div>
          <p>
           {renderMessage(logs?.communicationDetail?.message)}
          </p>
        </div>
      </div>

      <CommsLogsTable tableData={logs?.sessionLogs}/>
    </div>
  );
}


function renderDateTime(dateTime: string) {
  if(dateTime){
    const d = new Date(dateTime);
    const localeDate = d.toLocaleDateString();
    const localeTime = d.toLocaleTimeString();
    return `${localeDate} ${localeTime}`;
  }
  return 'N/A'
}


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