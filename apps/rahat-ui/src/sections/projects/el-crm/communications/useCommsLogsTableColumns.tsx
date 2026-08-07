import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { CircleAlert, TriangleAlert } from 'lucide-react';
import { formatDateTime } from '../../../../utils';

const getStatusVariant = (status: string) => {
  if (status === BroadcastStatus.FAIL) return 'destructive';
  if (status === BroadcastStatus.SUCCESS) return 'success';
  if (status === BroadcastStatus.PENDING) return 'warning';
  return 'secondary';
};

const toText = (value: unknown, depth = 0): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (depth > 3) return '';
  if (Array.isArray(value))
    return value
      .map((item) => toText(item, depth + 1))
      .filter(Boolean)
      .join(', ');
  if (typeof value === 'object') {
    const nested =
      (value as any).message ?? (value as any).error ?? (value as any).reason;
    const fromNested = toText(nested, depth + 1);
    if (fromNested) return fromNested;
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  return '';
};

const getStatusMessage = (disposition: unknown): string => {
  if (typeof disposition === 'string') return disposition.trim();
  if (!disposition || typeof disposition !== 'object') return '';
  const d = disposition as any;
  return (
    toText(d.message) ||
    toText(d.data?.message) ||
    toText(d.error) ||
    toText(d.reason)
  );
};

export default function useCommsLogsTableColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'audience',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audience
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {toText(row?.original?.address) || '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </span>
      ),
      cell: ({ row }) => {
        const status = toText(row?.original?.status);
        const statusMessage = getStatusMessage(row?.original?.disposition);

        if (!status) return <span className="text-sm">{'—'}</span>;

        if (status === 'FAIL') {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                  <TriangleAlert className="h-4 w-4 text-destructive" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <p className="text-sm">{statusMessage || 'Unknown error'}</p>
              </TooltipContent>
            </Tooltip>
          );
        }

        if (status === 'SCHEDULED' && statusMessage) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                  <CircleAlert className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <p className="text-sm">{statusMessage}</p>
              </TooltipContent>
            </Tooltip>
          );
        }

        return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'attempts',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Attempts
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {toText(row?.original?.attempts) || '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price
        </span>
      ),
      cell: ({ row }) => {
        const disposition = row?.original?.disposition;
        let price = toText(
          disposition && typeof disposition === 'object'
            ? (disposition as any).price
            : undefined,
        );
        if (price.startsWith('-')) price = price.substring(1);
        return (
          <span className="text-sm tabular-nums">{price || '\u2014'}</span>
        );
      },
    },
    {
      accessorKey: 'lastAttempt',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Triggered At
        </span>
      ),
      cell: ({ row }) => {
        const date =
          toText(row?.original?.lastAttempt) ||
          toText(row?.original?.createdAt);
        if (!date || Number.isNaN(new Date(date).getTime()))
          return <span className="text-sm">{'\u2014'}</span>;
        const { dateStr, timeStr } = formatDateTime(date);
        const isFallback = !row?.original?.lastAttempt;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm tabular-nums whitespace-nowrap">
                {dateStr}
                <span className="text-muted-foreground ml-1">{timeStr}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              {isFallback
                ? 'No send attempt yet \u2014 showing time queued'
                : 'Time the most recent send attempt was made'}
            </TooltipContent>
          </Tooltip>
        );
      },
    },
  ];
  return columns;
}
