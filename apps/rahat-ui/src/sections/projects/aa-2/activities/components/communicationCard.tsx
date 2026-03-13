'use client';

import React, { useMemo, useState } from 'react';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  Mail,
  MessageSquare,
  Mic,
  SendHorizonal,
  LoaderCircle,
  ArrowUpRightSquare,
} from 'lucide-react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useTriggerCommunication } from '@rahat-ui/query';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { SessionStatus } from '@rumsan/connect/src/types';
import MessageWithToggle from './messageWithToggle';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';

interface BaseCommunication {
  communicationTitle?: string;
  groupId: string;
  groupType: string;
  transportId: string;
  communicationId: string;
  subject: string;
  groupName: string;
  sessionStatus: string;
  sessionId: string;
  completedAt: string;
  onSend?: () => void;
  onEdit?: () => void;
}

interface EmailCommunication extends BaseCommunication {
  transportName: 'EMAIL' | 'SMS';
  message: string;
}

interface IVRCommunication extends BaseCommunication {
  transportName: 'VOICE';
  message: Record<string, never>;
}

type ActivityCommunication = EmailCommunication | IVRCommunication;

interface CommunicationCardProps {
  activityCommunication: ActivityCommunication;
}
export function CommunicationCard({
  activityCommunication,
}: CommunicationCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const confirmationDialog = useBoolean();
  const router = useRouter();

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
  const { id: projectId, activityID } = useParams();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from');
  const [loadingButtons, setLoadingButtons] = React.useState<string[]>([]);
  const trigger = useTriggerCommunication();
  const activityId = activityID as string;

  const redirectLink = useMemo(
    () =>
      `/projects/aa/${projectId}/communication-logs/commsdetails/${
        activityCommunication?.communicationId
      }@${activityId}@${activityCommunication?.sessionId}?from=activities${
        redirectTo ? `&backFrom=${redirectTo}` : ''
      }`,
    [activityCommunication, redirectTo, activityId, projectId],
  );

  const triggerCommunication = async (
    activityId: string,
    communicationId: string,
  ) => {
    setLoadingButtons((prev) => [...prev, communicationId]);
    try {
      await trigger.mutateAsync({
        projectUUID: projectId as UUID,
        activityCommunicationPayload: { communicationId, activityId },
      });
    } finally {
      setLoadingButtons((prev) => prev.filter((id) => id !== communicationId));
    }
  };

  const handleConfirmSend = async () => {
    confirmationDialog.onFalse();
    await triggerCommunication(
      activityId,
      activityCommunication?.communicationId,
    );
  };

  return (
    <Card className="mb-4 rounded-sm">
      <CardContent className="pt-4 px-4 pb-4">
        <div className="flex gap-3">
          {/* Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
            {getIcon()}
          </div>

          {/* Title and Meta Information */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-center gap-2 mb-1">
              <TooltipWrapper
                tip={`Communication Title: ${activityCommunication?.communicationTitle}`}
              >
                <h3 className="font-medium text-gray-900 truncate">
                  {activityCommunication?.communicationTitle}
                </h3>
              </TooltipWrapper>
              {activityCommunication?.sessionStatus !== SessionStatus.NEW && (
                <TooltipComponent
                  Icon={ArrowUpRightSquare}
                  tip="View Communication Log"
                  handleOnClick={() => router.push(redirectLink)}
                  iconStyle="text-primary"
                />
              )}
              <TooltipWrapper
                tip={`Communication Status: ${
                  activityCommunication?.sessionStatus.charAt(0).toUpperCase() +
                  activityCommunication?.sessionStatus.slice(1).toLowerCase()
                }`}
              >
                <Badge
                  className={`text-xs font-normal ${
                    activityCommunication?.sessionStatus === 'PENDING'
                      ? 'text-red-400 bg-yellow-100'
                      : activityCommunication?.sessionStatus === 'COMPLETED'
                      ? 'text-green-700 bg-green-200'
                      : 'text-red-700 bg-red-200'
                  }`}
                >
                  {activityCommunication?.sessionStatus
                    .charAt(0)
                    .toUpperCase() +
                    activityCommunication?.sessionStatus.slice(1).toLowerCase()}
                </Badge>
              </TooltipWrapper>
            </div>

            {/* Meta Information */}
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

          {/* Send Button */}
          {activityCommunication?.sessionStatus === SessionStatus.NEW && (
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
              hasContent={false}
            >
              <TooltipWrapper tip="Send Communication">
                <Button
                  className="h-10 w-10 rounded-full p-0 flex-shrink-0"
                  variant="outline"
                  onClick={confirmationDialog.onTrue}
                  type="button"
                >
                  {loadingButtons.includes(
                    activityCommunication?.communicationId,
                  ) ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    <SendHorizonal size={18} strokeWidth={1.5} />
                  )}
                </Button>
              </TooltipWrapper>
            </RoleAuth>
          )}
        </div>

        {/* Subject for Email */}
        {activityCommunication?.subject && (
          <TooltipWrapper
            tip={`Communication Subject: ${activityCommunication?.subject}`}
          >
            <h4 className="font-medium text-sm mt-3">
              {activityCommunication?.subject}
            </h4>
          </TooltipWrapper>
        )}

        {/* Message Content for Email/SMS */}
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

        {/* Voice Content */}
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

        {/* Completed At */}
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
      </CardContent>

      <ConfirmationDialog
        isConfirmationDialogOpen={confirmationDialog.value}
        onCancel={confirmationDialog.onFalse}
        onConfirm={handleConfirmSend}
        dialogTitle="Send Communication?"
      >
        <div>
          Are you sure you want to send
          <span className="font-bold mx-1">
            {activityCommunication?.transportName}
          </span>
          communication to the
          <span className="font-bold mx-1">
            {activityCommunication?.groupName}
          </span>
          Group?
        </div>
      </ConfirmationDialog>
    </Card>
  );
}
