'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { GCT_STATUS_STYLE } from '../types/gct.types';
import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/i18n/date';

export function fmt(date?: string | null, locale = 'en'): string {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const neOptions =
      locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
    const formatter = new Intl.DateTimeFormat(
      locale === 'ne' ? 'ne-NP' : locale,
      neOptions,
    );
    if (locale === 'ne') {
      return localizeNepaliParts(d, neOptions, formatter.formatToParts(d));
    }
    return formatter.format(d);
  } catch {
    return date;
  }
}

export function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono break-all' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}

export function GctStatusBadge({ status }: { status: string }) {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tGlobal = useTranslations('GLOBAL');
  const map: Record<string, string> = {
    NOT_STARTED: t('NOT_STARTED'),
    PENDING: tGlobal('PENDING'),
    STARTED: t('STARTED'),
    COMPLETED: tGlobal('COMPLETED'),
    SUCCESS: tGlobal('SUCCESS'),
    FAILED: tGlobal('FAILED'),
    REJECTED: t('REJECTED'),
  };
  return (
    <Badge className={`w-fit text-xs ${GCT_STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {map[status] ?? status.replace(/_/g, ' ')}
    </Badge>
  );
}
