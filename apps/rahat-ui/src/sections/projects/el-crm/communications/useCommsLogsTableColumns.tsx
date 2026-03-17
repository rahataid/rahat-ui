import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { TriangleAlert } from 'lucide-react';

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
        <span className="font-mono text-sm">{row?.original?.address || '\u2014'}</span>
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

        const errorMessage =
          disposition?.data?.message || disposition?.error || 'Unknown error';

        if (status === 'FAIL') {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                  <TriangleAlert className="h-3.5 w-3.5 text-destructive" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <p className="text-sm">{errorMessage}</p>
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
      cell: ({ row }) => {
        return <span className="tabular-nums">{row?.original?.attempts ?? '\u2014'}</span>;
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
        const date = row?.original?.createdAt;
        return date ? (
          <span className="tabular-nums text-muted-foreground">
            {new Date(date).toLocaleString()}
          </span>
        ) : (
          <span className="text-muted-foreground">{'\u2014'}</span>
        );
      },
    },
  ];
  return columns;
}

function getStatusVariant(status: string): 'destructive' | 'success' | 'warning' | 'secondary' {
  if (status === BroadcastStatus.FAIL) return 'destructive';
  if (status === BroadcastStatus.SUCCESS) return 'success';
  if (status === BroadcastStatus.PENDING) return 'warning';
  return 'secondary';
}
