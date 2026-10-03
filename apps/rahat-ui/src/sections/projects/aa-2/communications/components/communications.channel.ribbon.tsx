'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { MessageSquare, PhoneCall, Mail } from 'lucide-react';
import { Transport } from '@rumsan/connect/src/types';

type CommunicationsChannelRibbonProps = {
  sms: number;
  voice: number;
  email: number;
  transports?: Transport[];
};

const transportDescription = (
  transports: Transport[] | undefined,
  names: string[],
  fallback: string,
  t: any,
) => {
  const match = transports?.find((transport) =>
    names.includes(transport?.name?.toUpperCase()),
  );
  if (!match) return fallback;
  const upperName = match.name.toUpperCase();
  if (['SMS', 'VOICE', 'EMAIL'].includes(upperName)) {
    return t(upperName);
  }
  return match.name;
};

export function CommunicationsChannelRibbon({
  sms,
  voice,
  email,
  transports,
}: CommunicationsChannelRibbonProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const channels = [
    {
      label: t("SMS_BROADCASTS"),
      count: formatDigits(sms),
      description: transportDescription(transports, ['SMS', 'API', 'SES', 'ECHO'], t("NCELL_NTC_GATEWAYS_ACTIVE"), t),
      Icon: MessageSquare,
    },
    {
      label: t("VOICE_IVR_ALERTS"),
      count: formatDigits(voice),
      description: transportDescription(transports, ['VOICE'], t("BULK_VOICE_DISPATCH_SERVER"), t),
      Icon: PhoneCall,
    },
    {
      label: t("EMAIL_BULLETINS"),
      count: formatDigits(email),
      description: transportDescription(transports, ['EMAIL', 'SMTP'], t("STAKEHOLDER_NEWSLETTERS"), t),
      Icon: Mail,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {channels.map((ch, idx) => {
        const Icon = ch.Icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 px-3 py-2.5 bg-card border rounded-sm shadow-sm"
          >
            <div className="p-2 rounded-md bg-secondary text-primary shrink-0">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium truncate">{ch.label}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary shrink-0">
                  {ch.count}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{ch.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
