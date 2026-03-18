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

export const useMsgTableColumn = () => {
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
      accessorKey: 'createdAt',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Created Date</span>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.getValue('createdAt')
            ? new Date(row.getValue('createdAt')).toLocaleString()
            : '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'sessionId',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Status</span>
      ),
      cell: ({ row }) => {
        const isSent = !!row.getValue('sessionId');
        return (
          <Badge variant={isSent ? 'success' : 'secondary'}>
            {isSent ? 'Sent' : 'Draft'}
          </Badge>
        );
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
                href={`/projects/el-crm/${id}/communications/messages/${row.original.uuid}`}
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
