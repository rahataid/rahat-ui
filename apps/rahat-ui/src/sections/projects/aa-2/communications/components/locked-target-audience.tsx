'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n';
import { AudienceGroupOption } from './target-audience-selector';

type LockedTargetAudienceProps = {
  beneficiaries: AudienceGroupOption[];
  stakeholders: AudienceGroupOption[];
};

export function LockedTargetAudience({
  beneficiaries,
  stakeholders,
}: LockedTargetAudienceProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();

  return (
    <div className="space-y-2">
      <Label>
        {translateValue(t, 'TARGET_AUDIENCE', { fallback: 'Target Audience' })}
      </Label>
      <div className="p-4 rounded-md border bg-muted/30 space-y-2">
        <div className="flex flex-wrap gap-2">
          {beneficiaries.map((b: AudienceGroupOption) => (
            <Badge key={b.id} variant="secondary" className="text-xs py-1 px-2.5">
              {b.name} ({formatDigits(b.count)})
            </Badge>
          ))}
          {stakeholders.map((s: AudienceGroupOption) => (
            <Badge key={s.id} variant="secondary" className="text-xs py-1 px-2.5">
              {s.name} ({formatDigits(s.count)})
            </Badge>
          ))}
          {beneficiaries.length === 0 && stakeholders.length === 0 && (
            <span className="text-xs text-muted-foreground italic">
              {translateValue(t, 'NO_GROUPS_ASSIGNED', {
                fallback: 'No groups assigned',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
