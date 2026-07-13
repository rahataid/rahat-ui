'use client';

import { format } from 'date-fns';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { GCT_STATUS_STYLE } from '../types/gct.types';

export function fmt(date?: string | null): string {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy  hh:mm a');
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
  return (
    <Badge className={`w-fit text-xs ${GCT_STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
