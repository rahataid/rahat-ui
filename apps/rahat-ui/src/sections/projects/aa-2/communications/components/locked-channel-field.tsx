'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n';
import { CommunicationChannelIcon } from './communication-channel-icon';

type LockedChannelFieldProps = {
  channel?: string;
};

export function LockedChannelField({ channel = 'sms' }: LockedChannelFieldProps) {
  const t = useTranslations('AA_PROJECT');
  const normalizedChannel = (channel || 'SMS').toUpperCase();

  return (
    <div className="space-y-2">
      <Label>
        {translateValue(t, 'COMMUNICATION_CHANNEL', {
          fallback: 'Communication Channel',
        })}
      </Label>
      <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 text-sm flex items-center gap-2">
        <CommunicationChannelIcon
          channel={normalizedChannel}
          className="w-4 h-4"
        />
        <span className="capitalize">
          {translateValue(t, normalizedChannel, { fallback: normalizedChannel })}
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
          {translateValue(t, 'LOCKED', { fallback: 'Locked' })}
        </span>
      </div>
    </div>
  );
}
