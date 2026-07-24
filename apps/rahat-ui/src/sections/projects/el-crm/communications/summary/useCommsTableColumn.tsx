import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/components/dialog';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export const useCommsTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    return status === 'Delivered' ? 'success' : 'destructive';
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Date</span>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{row.getValue('date')}</span>
      ),
    },
    {
      accessorKey: 'channel',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Channel</span>
      ),
      cell: ({ row }) => (
        <Badge variant={getChannelVariant(row.getValue('channel'))}>
          {row.getValue('channel')}
        </Badge>
      ),
    },
    {
      accessorKey: 'group',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Group</span>
      ),
      cell: ({ row }) => (
        <span>{row.getValue('group') || '\u2014'}</span>
      ),
    },
    {
      accessorKey: 'templateName',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Template</span>
      ),
      cell: ({ row }) => (
        <span>{row.getValue('templateName') || '\u2014'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Status</span>
      ),
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('status'))}>
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: () => (
        <span className="text-xs uppercase tracking-wider">Actions</span>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const log = row.original;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View message details</TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Message Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Date
                    </Label>
                    <p className="mt-1 text-sm tabular-nums">
                      {format(new Date(log.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Channel
                    </Label>
                    <div className="mt-1">
                      <Badge variant={getChannelVariant(log.channel)}>
                        {log.channel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Template
                    </Label>
                    <p className="mt-1 text-sm">{log.templateName || '\u2014'}</p>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Message Content
                  </Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <p className="text-sm">{log.messageContent || '\u2014'}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Group Status
                  </Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <p className="text-sm">{log.groupStatus || '\u2014'}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];
  return columns;
};
