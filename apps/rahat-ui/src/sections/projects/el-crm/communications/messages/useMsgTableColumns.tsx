import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye, Trash2 } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { UUID } from 'crypto';
import { useDeleteElCrmCampaign } from '@rahat-ui/query';
import { getCampaignGroupLabel } from '../const';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { formatDateTime } from '../../../../../utils';

function DeleteCampaignAction({
  projectUUID,
  campaign,
}: {
  projectUUID: UUID;
  campaign: { uuid: string; name?: string };
}) {
  const deleteCampaign = useDeleteElCrmCampaign(projectUUID);

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              aria-label="Delete message"
              disabled={deleteCampaign.isPending}
              className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete message{' '}
            <span className="text-foreground">
              &quot;{campaign.name || 'Untitled'}&quot;
            </span>
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The message will be removed from this project and can no longer be
            sent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCampaign.mutate(campaign.uuid)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete message
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const useMsgTableColumn = (
  options: { hideRecipientCount?: boolean; isAutomatic?: boolean } = {},
) => {
  const { id } = useParams();
  const { hideRecipientCount = false, isAutomatic = false } = options;

  const isRetryRow = (row: any) =>
    (row.original?.options as Record<string, any>)?.isRetry === true;

  // Only messages that were never triggered (regular) or have no rule
  // attached (automated) can be deleted.
  const canDelete = (row: any) => {
    if (isAutomatic && !isRetryRow(row)) {
      return (row.original?.automationRules ?? []).length === 0;
    }
    return !row.original?.sessionId;
  };

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

  const allColumns: ColumnDef<any>[] = [
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
      cell: ({ row }) => (
        <span className="text-sm">
          {getCampaignGroupLabel(row.original as any)}
        </span>
      ),
    },
    {
      accessorKey: 'recipientCount',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recipients
        </span>
      ),
      cell: ({ row }) => {
        if (row.original?.isAutomatic && !isRetryRow(row)) {
          return <span className="text-sm text-muted-foreground">\u2014</span>;
        }
        return (
          <span className="text-sm tabular-nums">
            {row.getValue('recipientCount') || '\u2014'}
          </span>
        );
      },
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
        const { dateStr, timeStr } = formatDateTime(date);
        return (
          <span className="text-sm tabular-nums whitespace-nowrap">
            {dateStr}
            <span className="text-muted-foreground ml-1">{timeStr}</span>
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
        if (isAutomatic && !isRetryRow(row)) {
          const rules = (row.original?.automationRules ?? []) as Array<{
            isEnabled?: boolean;
          }>;
          if (rules.length === 0) {
            return <Badge variant="outline">No Rule</Badge>;
          }
          const enabled = rules.some((r) => r.isEnabled);
          return (
            <Badge variant={enabled ? 'success' : 'secondary'}>
              {enabled ? 'Active' : 'Paused'}
            </Badge>
          );
        }
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
          <div className="flex items-center gap-3">
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
            {canDelete(row) && (
              <DeleteCampaignAction
                projectUUID={id as UUID}
                campaign={row.original}
              />
            )}
          </div>
        );
      },
    },
  ];
  return hideRecipientCount
    ? allColumns.filter((c) => (c as any).accessorKey !== 'recipientCount')
    : allColumns;
};
