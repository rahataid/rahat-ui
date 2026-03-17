import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Eye } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { targetTypeMap } from '../const';

export const useScheduledTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getStatusVariant = (status: string): 'success' | 'secondary' | 'warning' => {
    switch (status) {
      case 'Sent':
        return 'success';
      case 'Scheduled':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Name
        </span>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name') || '\u2014'}</span>
      ),
    },
    {
      accessorKey: 'transportName',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Channel
        </span>
      ),
      cell: ({ row }) => {
        const channel = row.getValue('transportName') as string;
        return channel ? (
          <Badge variant="outline">{channel}</Badge>
        ) : (
          <span className="text-muted-foreground">{'\u2014'}</span>
        );
      },
    },
    {
      accessorKey: 'targetType',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Group
        </span>
      ),
      cell: ({ row }) => {
        const value = row.getValue('targetType') as keyof typeof targetTypeMap;
        return <span>{targetTypeMap[value] || '\u2014'}</span>;
      },
    },
    {
      accessorKey: 'recipientCount',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recipients
        </span>
      ),
      cell: ({ row }) => {
        const count = row.getValue('recipientCount') as number | null;
        return count != null ? (
          <span className="tabular-nums">{count}</span>
        ) : (
          <span className="text-muted-foreground">{'\u2014'}</span>
        );
      },
    },
    {
      id: 'scheduledTimestamp',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scheduled Date
        </span>
      ),
      accessorFn: (row) => row.options?.scheduledTimestamp,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? (
          <span className="tabular-nums text-muted-foreground">
            {new Date(value).toLocaleString()}
          </span>
        ) : (
          <span className="text-muted-foreground">{'\u2014'}</span>
        );
      },
    },
    {
      id: 'status',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </span>
      ),
      cell: ({ row }) => {
        const scheduledTime = row.original?.options?.scheduledTimestamp;
        const sessionId = row.original?.sessionId;

        let status = 'Draft';

        if (scheduledTime && new Date(scheduledTime) > new Date()) {
          status = 'Scheduled';
        } else if (sessionId) {
          status = 'Sent';
        }

        return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Actions
        </span>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/projects/el-crm/${id}/communications/scheduled/${row.original.uuid}`}
              >
                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>View scheduled message details</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];
  return columns;
};
