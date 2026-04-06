import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
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
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Name
        </span>
      ),
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm font-medium block max-w-[300px] truncate">
                {name || '\u2014'}
              </span>
            </TooltipTrigger>
            {name && name.length > 40 && (
              <TooltipContent side="bottom" className="max-w-xs">
                {name}
              </TooltipContent>
            )}
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'transportName',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Channel
        </span>
      ),
      cell: ({ row }) => {
        const label = row.getValue('transportName') as string;
        return <Badge variant={getChannelVariant(label)}>{label}</Badge>;
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
        return (
          <span className="text-sm">{targetTypeMap[value] || '\u2014'}</span>
        );
      },
    },
    {
      accessorKey: 'recipientCount',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recipients
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row.getValue('recipientCount') || '\u2014'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Created Date
        </span>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        if (!date) return <span className="text-sm">\u2014</span>;
        const d = new Date(date);
        return (
          <span className="text-sm tabular-nums whitespace-nowrap">
            {d.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            <span className="text-muted-foreground ml-1">
              {d.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </span>
        );
      },
    },
    {
      accessorKey: 'sessionId',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </span>
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
