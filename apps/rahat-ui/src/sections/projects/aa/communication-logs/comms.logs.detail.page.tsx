import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Component,
  Download,
  Hash,
  LucideIcon,
  MessageSquareMore,
  MessageSquareWarning,
  RefreshCcw,
  Timer,
  UsersRound,
} from 'lucide-react';
import CommsLogsTable from './comms.logs.table';
import { useParams } from 'next/navigation';
import {
  useGetCommunicationLogs,
  useListSessionLogs,
  usePagination,
  useRetryFailedBroadcast,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import { Player } from 'react-simple-player';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import React, { useMemo } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import useCommsLogsTableColumns from './useCommsLogsTableColumns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

type IHeadCardProps = {
  title: string;
  icon: LucideIcon;
  content: string;
};

export default function CommsLogsDetailPage() {
  const { id: projectID, commsIdXactivityIdXsessionId } = useParams();
  const [communicationId, activityId, sessionId] = (
    commsIdXactivityIdXsessionId as string
  ).split('%40');

  console.log('comms', communicationId);
  console.log('act', activityId);
  console.log('Session', sessionId);

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  const columns = useCommsLogsTableColumns();

  // logs?.sessionLogs

  const { data: logs, isLoading } = useGetCommunicationLogs(
    projectID as UUID,
    communicationId,
    activityId,
  );
  const { data: sessionLogs, isLoading: isLoadingSessionLogs } =
    useListSessionLogs(sessionId, { ...pagination });

  const logsMeta = sessionLogs?.httpReponse?.data?.meta;

  console.log('logs', logs);
  const mutateRetry = useRetryFailedBroadcast(
    projectID as UUID,
    communicationId,
    activityId,
  );

  const retryFailed = async () => {
    mutateRetry.mutateAsync();
  };

  const failedCount = useMemo(() => {
    return logs?.sessionLogs?.filter(
      (log: any) => log?.status === BroadcastStatus.FAIL,
    )?.length;
  }, [logs]);

  const logsGroupName = useMemo(() => {
    if (logs?.groupName.length > 20) {
      return `${logs?.groupName?.slice(0, 20)}...`;
    } else {
      return logs?.groupName;
    }
  }, [logs]);

  const table = useReactTable({
    manualPagination: true,
    data: sessionLogs?.httpReponse?.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const headCardFields = [
    {
      title: 'Total Audience',
      icon: Hash,
      content: logsMeta?.total || 'N/A',
    },
    {
      title: 'Triggered At',
      icon: Timer,
      content: renderDateTime(logs?.sessionDetails?.createdAt),
    },
    {
      title: 'Group Name',
      icon: UsersRound,
      content: logsGroupName || 'N/A',
    },
    {
      title: 'Group Type',
      icon: Component,
      content: logs?.communicationDetail?.groupType || 'N/A',
    },
    {
      title: 'Status',
      icon: MessageSquareWarning,
      content: (
        <Badge className="bg-orange-100 text-orange-600">
          {logs?.sessionDetails?.status}
        </Badge>
      ),
    },
  ];

  if (isLoading || isLoadingSessionLogs) {
    return <Loader />;
  }

  return (
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-xl">Communication Details</h1>
        <div className="flex gap-2">
          <Button type="button">
            <Download className="mr-2" size={16} strokeWidth={2} />
            <span className="font-normal">Failed Exports</span>
          </Button>
          {failedCount > 0 && (
            <Button type="button" onClick={retryFailed}>
              <RefreshCcw className="mr-2" size={16} strokeWidth={2} />
              <span className="font-normal">Retry Failed</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
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
        <div className="flex justify-start space-x-8 items-center">
          <div className="flex space-x-4">
            <div className="h-12 w-12 rounded-full border border-muted-foreground grid place-items-center">
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

          <div className="w-full">
            {renderMessage(logs?.communicationDetail?.message)}
          </div>
        </div>
      </div>

      <CommsLogsTable table={table} />
      <CustomPagination
        meta={
          logsMeta || {
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }
        }
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={logsMeta?.lastPage || 0}
      />
    </div>
  );
}

function renderDateTime(dateTime: string) {
  if (dateTime) {
    const d = new Date(dateTime);
    const localeDate = d.toLocaleDateString();
    const localeTime = d.toLocaleTimeString();
    return `${localeDate} ${localeTime}`;
  }
  return 'N/A';
}

function renderMessage(message: any) {
  if (typeof message === 'string') {
    return message;
  }
  return (
    <div className="bg-card space-x-8 flex items-center">
      <a
        className="cursor-pointer inline-flex"
        href={message?.mediaURL}
        target="_blank"
      >
        <Download size={20} strokeWidth={1.5} className="mr-2" />
        <span>{`${message?.fileName?.substring(0, 20)}...`}</span>
      </a>
      <div className="p-2 w-1/2">
        <Player
          src={message?.mediaURL}
          accent={[41, 121, 214]}
          grey={[250, 250, 250]}
        />
      </div>
    </div>
  );
}

// function renderBadgeBg(status: string) {
//   if(status === SessionStatus.FAILED){
//     return "bg-red-200"
//   }
//   if(status === SessionStatus.COMPLETED){
//     return "bg-green-200"
//   }
//   if(status === SessionStatus.PENDING){
//     return
//   }
//   return "bg-gray-200"
// }
