'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { MessageSquare, PhoneCall, Mail } from 'lucide-react';

const channels = [
  {
    label: 'SMS Broadcasts',
    count: '892',
    description: 'Ncell / NTC Gateways Active',
    Icon: MessageSquare,
  },
  {
    label: 'Voice / IVR Alerts',
    count: '240',
    description: 'Bulk Voice Dispatch Server',
    Icon: PhoneCall,
  },
  {
    label: 'Email Bulletins',
    count: '116',
    description: 'Stakeholder Newsletters',
    Icon: Mail,
  },
];

export function CommunicationsChannelRibbon() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const channels = [
  {
    label: t("SMS_BROADCASTS"),
    count: formatDigits("892"),
    description: t("NCELL_NTC_GATEWAYS_ACTIVE"),
    Icon: MessageSquare,
  },
  {
    label: t("VOICE_IVR_ALERTS"),
    count: formatDigits("240"),
    description: t("BULK_VOICE_DISPATCH_SERVER"),
    Icon: PhoneCall,
  },
  {
    label: t("EMAIL_BULLETINS"),
    count: formatDigits("116"),
    description: t("STAKEHOLDER_NEWSLETTERS"),
    Icon: Mail,
  },
];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {channels.map((ch, idx) => {
        const Icon = ch.Icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-card border rounded-md"
          >
            <div className="p-2 rounded-md bg-secondary text-primary">
              <Icon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{ch.label}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary">
                  {ch.count}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{ch.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
