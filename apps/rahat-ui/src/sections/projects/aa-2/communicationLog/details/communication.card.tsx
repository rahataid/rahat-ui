'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CloudDownload,
  Mail,
  MessageSquare,
  Mic,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  useListSessionLogs,
  usePagination,
  useSessionBroadCastCount,
} from '@rahat-ui/query';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import * as XLSX from 'xlsx';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { formatEnumString } from 'apps/rahat-ui/src/utils/string';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import MessageWithToggle from '../../activities/components/messageWithToggle';

interface BaseCommunication {
  groupId: string;
  groupType: string;
  transportId: string;
  communicationId: string;
  communicationTitle: string;
  groupName: string;
  sessionStatus: string;
  sessionId: string;
  completedAt: string;
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
  const { pagination, filters } = usePagination();
  const { data: sessionLogs } = useListSessionLogs(
    activityCommunication?.sessionId,
    {
      ...pagination,
      ...filters,
    },
  );
  const router = useRouter();
  const count = useSessionBroadCastCount([activityCommunication?.sessionId]);

  const [isPlaying, setIsPlaying] = useState(false);

  const getSessionStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-red-400 bg-yellow-100';
      case 'COMPLETED':
        return 'text-green-700 bg-green-200';
      case 'FAILED':
        return 'text-red-700 bg-red-200';
      default:
        return 'bg-gray-200';
    }
  };

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

  const onFailedExports = () => {
    const logs = sessionLogs?.httpReponse?.data?.data?.filter(
      (log: any) => log?.status === BroadcastStatus.FAIL,
    );

    if (!logs?.length) return;

    const workbook = XLSX.utils.book_new();
    const worksheetData = logs.map((log: any) => ({
      Address: log.address,
      Status: log.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FailedLogs');

    XLSX.writeFile(workbook, 'CommunicationFailed.xlsx');
  };

  const hasNoFailedDeliveries = (count?.data?.data?.FAIL ?? 0) === 0;

  return (
    <Card className="mb-4 rounded-sm">
      <CardContent className="pt-4 px-4 pb-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TooltipWrapper
                tip={`Communication Title: ${activityCommunication?.communicationTitle}`}
              >
                <h3 className="font-medium text-gray-900 truncate">
                  {activityCommunication?.communicationTitle}
                </h3>
              </TooltipWrapper>
              <TooltipWrapper
                tip={`Communication Status: ${
                  activityCommunication?.sessionStatus
                    ? formatEnumString(activityCommunication.sessionStatus)
                    : 'Unknown'
                }`}
              >
                <Badge
                  className={`text-xs font-normal ${getSessionStatusBadgeClass(
                    activityCommunication?.sessionStatus,
                  )}`}
                >
                  {activityCommunication?.sessionStatus
                    ? formatEnumString(activityCommunication.sessionStatus)
                    : 'Unknown'}
                </Badge>
              </TooltipWrapper>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TooltipWrapper
                tip={`Communication Channel: ${activityCommunication?.transportName}`}
              >
                <span>{activityCommunication?.transportName}</span>
              </TooltipWrapper>
              <span>•</span>
              <TooltipWrapper
                tip={`Group Type: ${activityCommunication?.groupType}`}
              >
                <span>{activityCommunication?.groupType}</span>
              </TooltipWrapper>
              <span>•</span>
              <TooltipWrapper
                tip={`Group Name: ${activityCommunication?.groupName}`}
              >
                <span>{activityCommunication?.groupName}</span>
              </TooltipWrapper>
            </div>
          </div>
        </div>

        {'subject' in activityCommunication &&
          activityCommunication?.subject && (
            <TooltipWrapper
              tip={`Communication Subject: ${activityCommunication?.subject}`}
            >
              <h4 className="font-medium text-sm mt-3">
                {activityCommunication?.subject}
              </h4>
            </TooltipWrapper>
          )}

        {(activityCommunication?.transportName === 'EMAIL' ||
          activityCommunication?.transportName === 'SMS') && (
          <TooltipWrapper
            tip={`Communication Message: ${activityCommunication?.message?.substring(
              0,
              50,
            )}${activityCommunication?.message?.length > 50 ? '...' : ''}`}
          >
            <div className="mt-2">
              <MessageWithToggle
                message={activityCommunication?.message ?? ''}
              />
            </div>
          </TooltipWrapper>
        )}

        {activityCommunication?.transportName === 'VOICE' &&
          Object.keys(activityCommunication?.message).length !== 0 && (
            <TooltipWrapper
              tip={`Voice File: ${activityCommunication?.message?.fileName}`}
            >
              <div className="bg-gray-50 p-3 rounded-sm mt-3">
                <p className="text-center mb-2 text-sm font-medium">
                  {activityCommunication?.message?.fileName}
                </p>
                <audio
                  src={activityCommunication?.message?.mediaURL}
                  controls
                  className="w-full h-10"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            </TooltipWrapper>
          )}

        {activityCommunication?.sessionStatus === 'COMPLETED' && (
          <TooltipWrapper
            tip={`Completed At: ${dateFormat(
              activityCommunication.completedAt,
            )}`}
          >
            <p className="mt-3 text-sm text-gray-500">
              Completed at: {dateFormat(activityCommunication.completedAt)}
            </p>
          </TooltipWrapper>
        )}

        <CardFooter className="pt-4 px-0 pb-0 flex justify-end">
          <div className="flex gap-3">
            <TooltipWrapper
              tip="No failed deliveries to export"
              disable={!hasNoFailedDeliveries}
            >
              <Button
                variant="outline"
                className="gap-2"
                onClick={onFailedExports}
                disabled={hasNoFailedDeliveries}
              >
                Failed Exports
                <CloudDownload className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <Button
              variant="outline"
              className="flex-1 gap-2 text-blue-600 border-blue-200"
              onClick={onViewDetails}
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
