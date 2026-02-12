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

export const useCommsTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    return status === 'Delivered' ? 'default' : 'destructive';
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800';
      case 'WhatsApp':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('date')}</div>,
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => (
        <Badge
          className={getChannelColor(row.getValue('channel'))}
          variant="secondary"
        >
          {row.getValue('channel')}
        </Badge>
      ),
    },
    {
      accessorKey: 'group',
      header: 'Group',
      cell: ({ row }) => <div>{row.getValue('group') || 'N/A'}</div>,
    },
    {
      accessorKey: 'templateName',
      header: 'Template Name',
      cell: ({ row }) => <div>{row.getValue('templateName') || 'N/A'}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('status'))}>
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const log = row.original;
        return (
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Message Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Date
                    </Label>
                    <p className="text-sm">
                      {format(new Date(log.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Channel
                    </Label>
                    <div className="mt-1">
                      <Badge
                        className={getChannelColor(log.channel)}
                        variant="secondary"
                      >
                        {log.channel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Template
                    </Label>
                    <p className="text-sm">{log.templateName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
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
                  <Label className="text-sm font-medium text-muted-foreground">
                    Message Content
                  </Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <p className="text-sm">{log.messageContent}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Group Status
                  </Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <p className="text-sm">{log.groupStatus}</p>
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
