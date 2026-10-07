'use client';

import React from 'react';
import { MessageSquare, PhoneCall, Mail, LucideIcon } from 'lucide-react';

export const CHANNEL_ICONS: Record<string, LucideIcon> = {
  SMS: MessageSquare,
  VOICE: PhoneCall,
  EMAIL: Mail,
};

interface CommunicationChannelIconProps {
  channel?: string;
  className?: string;
}

export const CommunicationChannelIcon: React.FC<CommunicationChannelIconProps> = ({
  channel,
  className = 'h-4 w-4 text-muted-foreground',
}) => {
  const Icon = CHANNEL_ICONS[(channel || '').toUpperCase()] || MessageSquare;
  return <Icon className={className} />;
};
