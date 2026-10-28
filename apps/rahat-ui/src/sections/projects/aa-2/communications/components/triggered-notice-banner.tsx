'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n';

export function TriggeredNoticeBanner() {
  const t = useTranslations('AA_PROJECT');

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-xs text-amber-800 flex items-start gap-3">
      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">
          {translateValue(t, 'COMMUNICATION_TRIGGERED_NOTICE', {
            fallback: 'Broadcast Already Triggered',
          })}
        </p>
        <p className="text-xs text-amber-700 mt-1">
          {translateValue(t, 'TRIGGERED_LOCKED_DESC', {
            fallback:
              'Recipients and delivery channel are locked because messages have already begun delivery. You can update the title and message content.',
          })}
        </p>
      </div>
    </div>
  );
}
