'use client';

import React, { useState } from 'react';
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
  SendHorizonal,
  LoaderCircle,
} from 'lucide-react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { IconLabelBtn, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useTriggerCommunication } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { SessionStatus } from '@rumsan/connect/src/types';
import MessageWithToggle from './messageWithToggle';

interface BaseCommunication {
  groupId: string;
  groupType: string;
  transportId: string;
  communicationId: string;
  groupName: string;
  sessionStatus: string;
  onSend?: () => void;
  onEdit?: () => void;
}

interface EmailCommunication extends BaseCommunication {
  transportName: 'EMAIL' | 'SMS';
  message: string;
}

interface IVRCommunication extends BaseCommunication {
  transportName: 'IVR';
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

  const getIcon = () => {
    switch (activityCommunication?.transportName) {
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-gray-500" />;
      case 'IVR':
        return <Mic className="h-5 w-5 text-gray-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  const { id: projectId, activityID } = useParams();
  const [loadingButtons, setLoadingButtons] = React.useState<string[]>([]);
  const trigger = useTriggerCommunication();
  const activityId = activityID as string;

  const [showFull, setShowFull] = useState(false);
  const maxLength = 150;
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

  return (
    <Card className="mb-4 rounded-sm">
      <CardContent className="pt-2 px-2 pb-2">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {activityCommunication?.groupName}
              </h3>
              <div className="flex gap-2">
                {activityCommunication?.sessionStatus === SessionStatus.NEW && (
                  <Button
                    className="items-center justify-center"
                    variant="ghost"
                    onClick={() =>
                      triggerCommunication(
                        activityId,
                        activityCommunication?.communicationId,
                      )
                    }
                    type="button"
                  >
                    {loadingButtons.includes(
                      activityCommunication?.communicationId,
                    ) ? (
                      <LoaderCircle size={20} className={`animate-spin `} />
                    ) : (
                      <SendHorizonal size={18} strokeWidth={1.5} />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>{activityCommunication?.transportName}</span>
              <span>•</span>
              <span>{activityCommunication?.groupType}</span>
              <span>•</span>
              <Badge
                className={`ml-1 text-xs font-normal ${
                  activityCommunication?.sessionStatus === 'PENDING'
                    ? 'text-red-400 bg-yellow-100'
                    : activityCommunication?.sessionStatus === 'COMPLETED'
                    ? 'text-green-700 bg-green-200'
                    : 'text-red-700 bg-red-200'
                }`}
              >
                {activityCommunication?.sessionStatus.charAt(0).toUpperCase() +
                  activityCommunication?.sessionStatus.slice(1).toLowerCase()}
              </Badge>
            </div>

            {(activityCommunication?.transportName === 'EMAIL' ||
              activityCommunication?.transportName === 'SMS') && (
              <div className="mt-3">
                <MessageWithToggle
                  message={activityCommunication?.message ?? ''}
                />
              </div>
            )}

            {activityCommunication?.transportName === 'IVR' &&
              Object.keys(activityCommunication?.message).length !== 0 && (
                <div className="mt-3">
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">
                      {activityCommunication?.message?.fileName}
                    </h3>
                    <audio
                      src={activityCommunication?.message?.mediaURL}
                      controls
                      className="w-full h-10 "
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
