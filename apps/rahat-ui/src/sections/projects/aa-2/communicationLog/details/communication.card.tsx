'use client';

import { useMemo, useState } from 'react';
import {
  Mail,
  MessageSquare,
  Mic,
  ChevronDown,
  ChevronUp,
  Edit,
  Send,
  Play,
  Pause,
  Cloud,
  ArrowRight,
  CloudDownload,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { useListSessionLogs, usePagination } from '@rahat-ui/query';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import * as XLSX from 'xlsx';

interface BaseCommunication {
  groupId: string;
  groupType: string;
  transportId: string;
  communicationId: string;
  groupName: string;
  sessionStatus: string;
  sessionId: string;
}

interface EmailCommunication extends BaseCommunication {
  transportName: 'EMAIL' | 'SMS';
  message: string;
  subject?: string;
}

interface IVRCommunication extends BaseCommunication {
  transportName: 'VOICE';
  message: Record<string, never>;
}

type ActivityCommunication = EmailCommunication | IVRCommunication;

interface CommunicationCardProps {
  activityCommunication: ActivityCommunication;
  activityId: string;
  projectId: string;
}
export function CommunicationDetailCard({
  activityCommunication,
  activityId,
  projectId,
}: CommunicationCardProps) {
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();
  const { data: sessionLogs, isLoading: isLoadingSessionLogs } =
    useListSessionLogs(activityCommunication?.sessionId, {
      ...pagination,
      ...filters,
    });
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = () => {
    switch (activityCommunication?.transportName) {
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-gray-500" />;
      case 'VOICE':
        return <Mic className="h-5 w-5 text-gray-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const onViewDetails = () => {
    router.push(
      `/projects/aa/${projectId}/communication-logs/commsdetails/${activityCommunication?.communicationId}@${activityId}@${activityCommunication?.sessionId}`,
    );
  };

  const failedCount = useMemo(() => {
    return (
      sessionLogs?.httpReponse?.data?.data?.filter(
        (log: any) => log?.status === BroadcastStatus.FAIL,
      ) ?? []
    );
  }, [sessionLogs]);
  const onFailedExports = () => {
    const logs = sessionLogs?.httpReponse?.data?.data?.filter(
      (log: any) => log?.status === BroadcastStatus.FAIL,
    );

    if (!logs?.length) return;

    const rowsToDownload = logs || [];
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((log: any) => ({
      Address: log.address,
      Status: log.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FailedLogs');

    XLSX.writeFile(workbook, 'CommunicationFailed.xlsx');
  };
  console.log(activityCommunication);
  return (
    <Card className="rounded-sm pb-0 flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            {getIcon()}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {activityCommunication?.groupName}
              </h3>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span> {activityCommunication?.transportName}</span>
              <span>•</span>
              <span>{activityCommunication?.groupType}</span>
              <span>•</span>
              <Badge
                className={`ml-1 text-xs font-normal ${
                  activityCommunication?.sessionStatus === 'PENDING'
                    ? 'text-red-400 bg-yellow-100'
                    : activityCommunication?.sessionStatus === 'COMPLETED'
                    ? 'text-green-700 bg-green-200'
                    : activityCommunication.sessionStatus === 'FAILED'
                    ? 'text-red-700 bg-red-200'
                    : 'bg-gray-200'
                }`}
              >
                {activityCommunication?.sessionStatus.charAt(0).toUpperCase() +
                  activityCommunication?.sessionStatus.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 min-h-[60px] flex-grow">
        {(activityCommunication?.transportName === 'EMAIL' ||
          activityCommunication?.transportName === 'SMS') && (
          <div className="flex flex-col gap-0">
            {activityCommunication?.transportName === 'EMAIL' && (
              <p className="text-sm text-gray-700">
                {activityCommunication?.subject}
              </p>
            )}
            <p className="text-sm text-gray-700 py-1.5">
              {activityCommunication?.message}
            </p>
          </div>
        )}

        {activityCommunication?.transportName === 'VOICE' &&
          Object.keys(activityCommunication?.message).length !== 0 && (
            <div className="mt-3">
              <audio
                src={activityCommunication?.message?.mediaURL}
                controls
                className="w-full h-10 p-0"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          )}
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex justify-end">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className=" gap-2"
            onClick={onFailedExports}
            disabled={failedCount.length === 0}
          >
            Failed Exports
            <CloudDownload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 text-blue-600 border-blue-200"
            onClick={onViewDetails}
            disabled={activityCommunication?.sessionStatus === 'NEW'}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
