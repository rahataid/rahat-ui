import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { targetTypeMap } from '../const';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export const useScheduledTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getChannelVariant = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'default';
      case 'WhatsApp':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
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
        <span className="text-xs uppercase tracking-wider">Name</span>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name') || '\u2014'}</span>
      ),
    },
    {
      accessorKey: 'transportName',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Channel</span>
      ),
      cell: ({ row }) => (
        <Badge variant={getChannelVariant(row.getValue('transportName'))}>
          {row.getValue('transportName')}
        </Badge>
      ),
    },
    {
      accessorKey: 'targetType',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Group</span>
      ),
      cell: ({ row }) => {
        const value = row.getValue('targetType') as keyof typeof targetTypeMap;
        return <span>{targetTypeMap[value] || '\u2014'}</span>;
      },
    },
    {
      accessorKey: 'recipientCount',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Recipients</span>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.getValue('recipientCount') || '\u2014'}
        </span>
      ),
    },
    {
      id: 'scheduledTimestamp',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Scheduled Date</span>
      ),
      accessorFn: (row) => row.options?.scheduledTimestamp,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <span className="tabular-nums">
            {value ? new Date(value).toLocaleString() : '\u2014'}
          </span>
        );
      },
    },
    {
      id: 'status',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Status</span>
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
        <span className="text-xs uppercase tracking-wider">Actions</span>
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
            <TooltipContent>View details</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];
  return columns;
};
