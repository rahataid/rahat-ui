import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { targetTypeMap } from '../const';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export function getStatus(row: any) {
  const scheduledTime = row?.options?.scheduledTimestamp;
  const sessionId = row?.sessionId;
  if (scheduledTime && new Date(scheduledTime) > new Date()) return 'Scheduled';
  if (sessionId) return 'Sent';
  return 'Draft';
}

function formatRelative(diffMs: number) {
  const abs = Math.abs(diffMs);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((abs % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${Math.max(seconds, 1)}s`;
}

function ScheduledDateCell({ value, row }: { value: string; row: any }) {
  const [now, setNow] = useState(() => new Date());
  const status = getStatus(row.original);
  const isCountdown = status === 'Scheduled' || status === 'Draft';

  useEffect(() => {
    if (!isCountdown) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isCountdown]);

  const scheduledDate = new Date(value);
  const diffMs = scheduledDate.getTime() - now.getTime();
  const formatted = formatRelative(diffMs);

  let relativeLabel = '';
  let colorClass = 'text-muted-foreground';

  if (status === 'Sent') {
    relativeLabel = `${formatted} ago`;
    colorClass = 'text-muted-foreground';
  } else if (diffMs > 0) {
    relativeLabel = `${formatted} remaining`;
    colorClass = 'text-amber-600';
  } else {
    relativeLabel = `${formatted} overdue`;
    colorClass = 'text-destructive';
  }

  return (
    <div className="flex flex-col">
      <span className="tabular-nums">{scheduledDate.toLocaleString()}</span>
      <span className={`text-xs mt-0.5 tabular-nums ${colorClass}`}>
        {relativeLabel}
      </span>
    </div>
  );
}

export const useScheduledTableColumn = () => {
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
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Name
        </span>
      ),
      cell: ({ row }) => {
        const name = (row.getValue('name') as string) || '\u2014';
        return (
          <span
            className="block max-w-[260px] truncate font-medium"
            title={name}
          >
            {name}
          </span>
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
      cell: ({ row }) => (
        <Badge variant={getChannelVariant(row.getValue('transportName'))}>
          {row.getValue('transportName')}
        </Badge>
      ),
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
      id: 'scheduledTimestamp',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scheduled Date
        </span>
      ),
      accessorFn: (row) => row.options?.scheduledTimestamp,
      cell: ({ getValue, row }) => {
        const value = getValue<string>();
        if (!value)
          return <span className="text-sm tabular-nums">{'\u2014'}</span>;
        return <ScheduledDateCell value={value} row={row} />;
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
        const status = getStatus(row.original);
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
            <TooltipContent>View details</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];
  return columns;
};
