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
          {row?.original?.address || '\u2014'}
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
        const status = row?.original?.status;
        const disposition = row?.original?.disposition;

        const statusMessage =
          disposition?.message ||
          disposition?.data?.message ||
          disposition?.error ||
          disposition?.reason;

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
          {row?.original?.attempts ?? '\u2014'}
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
        let price = row?.original?.disposition?.price;
        if (typeof price === 'string' && price.startsWith('-')) {
          price = price.substring(1);
        }
        return (
          <span className="text-sm tabular-nums">
            {price !== undefined && price !== null && price !== ''
              ? price
              : '\u2014'}
          </span>
        );
      },
    },
    {
      accessorKey: 'timeStamp',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Timestamp
        </span>
      ),
      cell: ({ row }) => {
        const date = row?.original?.createdAt as string;
        if (!date) return <span className="text-sm">\u2014</span>;
        const { dateStr, timeStr } = formatDateTime(date);
        return (
          <span className="text-sm tabular-nums whitespace-nowrap">
            {dateStr}
            <span className="text-muted-foreground ml-1">{timeStr}</span>
          </span>
        );
      },
    },
  ];
  return columns;
}
