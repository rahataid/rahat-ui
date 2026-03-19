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
      header: 'Audience',
      cell: ({ row }) => <div className="">{row?.original?.address}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
                  <Badge className={renderBadgeBg(status)}>{status}</Badge>
                  <TriangleAlert className="h-4 w-4 text-destructive" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs break-words">
                <p className="text-sm">{errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          );
        }

        return <Badge className={renderBadgeBg(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'attempts',
      header: 'Attempts',
      cell: ({ row }) => {
        return <div className="ml-8">{row?.original?.attempts}</div>;
      },
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{renderDateTime(row?.original?.createdAt)}</div>,
    },
  ];
  return columns;
}

function renderDateTime(dateTime: string) {
  if (dateTime) {
    const d = new Date(dateTime);
    const localeDate = d.toLocaleDateString();
    const localeTime = d.toLocaleTimeString();
    return `${localeDate} ${localeTime}`;
  }
  return 'N/A';
}

function renderBadgeBg(status: string) {
  if (status === BroadcastStatus.FAIL) {
    return 'bg-destructive/10 text-destructive';
  }
  if (status === BroadcastStatus.SUCCESS) {
    return 'bg-success/10 text-success';
  }
  if (status === BroadcastStatus.PENDING) {
    return 'bg-warning/10 text-warning';
  }
  return 'bg-muted text-muted-foreground';
}
