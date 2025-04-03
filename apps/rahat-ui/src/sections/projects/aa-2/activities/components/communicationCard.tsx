'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type CommunicationType = 'SMS' | 'Email' | 'IVR';

interface CommunicationCardProps {
  groupName: string;
  type: CommunicationType;
  stakeholders: string;
  status: 'Pending' | 'Sent' | 'Failed';
  message?: string;
  audioSrc?: string;
  onEdit?: () => void;
  onSend?: () => void;
}

export function CommunicationCard({
  groupName,
  type,
  stakeholders,
  status,
  message,
  audioSrc,
  onEdit,
  onSend,
}: CommunicationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getIcon = () => {
    switch (type) {
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      case 'Email':
        return <Mail className="h-5 w-5 text-gray-500" />;
      case 'IVR':
        return <Mic className="h-5 w-5 text-gray-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-1">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{groupName}</h3>
              <div className="flex gap-2">
                <IconLabelBtn
                  Icon={Edit}
                  name="Edit"
                  handleClick={() => onEdit}
                  variant="ghost"
                />
                <IconLabelBtn
                  Icon={Send}
                  name="Send"
                  handleClick={() => onSend}
                  variant="ghost"
                />
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span>{type}</span>
              <span>•</span>
              <span>{stakeholders}</span>
              <span>•</span>
              <Badge
                variant={
                  status === 'Pending'
                    ? 'outline'
                    : status === 'Sent'
                    ? 'default'
                    : 'destructive'
                }
                className="ml-1"
              >
                {status}
              </Badge>
            </div>

            {type !== 'IVR' && message && (
              <div className="mt-3">
                <p className="text-sm text-gray-700">
                  {expanded
                    ? message
                    : message.length > 100
                    ? `${message.substring(0, 100)}...`
                    : message}
                </p>
                {message.length > 100 && (
                  <Button
                    variant="link"
                    className="mt-1 h-auto p-0 text-primary"
                    onClick={toggleExpand}
                  >
                    {expanded ? (
                      <span className="flex items-center">
                        View Less <ChevronUp className="ml-1 h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        View Full Message{' '}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </div>
            )}

            {type === 'IVR' && audioSrc && (
              <div className="mt-3">
                <p className="text-sm text-gray-700">Audiorecord.mp4</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs text-gray-500">{currentTime}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 w-1/5 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{duration}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-primary text-white hover:bg-primary/90"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
