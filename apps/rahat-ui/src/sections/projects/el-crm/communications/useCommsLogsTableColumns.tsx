import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { TriangleAlert } from 'lucide-react';

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
        <span className="text-xs uppercase tracking-wider">Audience</span>
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row?.original?.address || '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Status</span>
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
                <div className="flex items-center gap-2 cursor-pointer">
                  <Badge variant={getStatusVariant(status)}>{status}</Badge>
                  <TriangleAlert className="h-4 w-4 text-destructive" />
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
        <span className="text-xs uppercase tracking-wider">Attempts</span>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{row?.original?.attempts ?? '\u2014'}</span>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Timestamp</span>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {renderDateTime(row?.original?.createdAt)}
        </span>
      ),
    },
  ];
  return columns;
}

function renderDateTime(dateTime: string) {
  if (dateTime) {
    const d = new Date(dateTime);
    return d.toLocaleString();
  }
  return '\u2014';
}
