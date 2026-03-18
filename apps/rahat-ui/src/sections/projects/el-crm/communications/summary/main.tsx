'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  Plus,
  MessageSquare,
  CheckCircle,
  XCircle,
  Smartphone,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useCommsTableColumn } from './useCommsTableColumn';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useListElCrmCampaign, usePagination } from '@rahat-ui/query';
import { useMsgTableColumn } from '../messages/useMsgTableColumns';

const messageLogs = [
  {
    id: 1,
    date: '2024-01-20',
    channel: 'SMS',
    group: 'Customers',
    templateName: 'Welcome Message',
    status: 'Delivered',
    messageContent:
      "Welcome to our service! We're excited to have you on board. Your account has been successfully created.",
    groupStatus: 'Active customers - 245 recipients',
  },
  {
    id: 2,
    date: '2024-01-19',
    channel: 'WhatsApp',
    group: 'Customers',
    templateName: 'Product Update',
    status: 'Delivered',
    messageContent:
      "We've just launched new features in our app! Check out the latest updates and improvements.",
    groupStatus: 'Active customers - 189 recipients',
  },
  {
    id: 3,
    date: '2024-01-18',
    channel: 'SMS',
    group: 'Customers',
    templateName: 'Reminder',
    status: 'Failed',
    messageContent:
      "Don't forget about your upcoming appointment scheduled for tomorrow at 2:00 PM.",
    groupStatus: 'Inactive customers - 67 recipients',
  },
];

export default function SummaryView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const columns = useMsgTableColumn();
  const { data, meta } = useListElCrmCampaign(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
  });

  const table = useReactTable({
    manualPagination: true,
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Communication Center
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Send messages and track communication logs
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
                >
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Message
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Compose a new message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Total Messages Sent',
                value: '1,247',
                icon: MessageSquare,
                color: 'text-primary',
                bgColor: 'bg-primary/5',
                iconColor: 'text-primary',
                tooltip: 'Total messages sent across all channels',
              },
              {
                title: 'Delivery Successful',
                value: '1,156',
                icon: CheckCircle,
                color: 'text-success',
                bgColor: 'bg-success/5',
                iconColor: 'text-success',
                tooltip: 'Messages successfully delivered to recipients',
              },
              {
                title: 'Delivery Failed',
                value: '91',
                icon: XCircle,
                color: 'text-destructive',
                bgColor: 'bg-destructive/5',
                iconColor: 'text-destructive',
                tooltip: 'Messages that failed to deliver',
              },
              {
                title: 'Most Used Channel',
                value: 'SMS',
                icon: Smartphone,
                color: 'text-foreground',
                bgColor: 'bg-muted',
                iconColor: 'text-muted-foreground',
                tooltip: 'The channel used most frequently for messaging',
              },
            ].map((stat) => (
              <Card
                key={stat.title}
                className="relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground leading-none">
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold tracking-tight tabular-nums ${stat.color}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="max-w-[220px]">{stat.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Successful Delivery by Channel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">SMS</Badge>
                    <span className="font-semibold tabular-nums text-success">
                      456
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">WhatsApp</Badge>
                    <span className="font-semibold tabular-nums text-success">
                      700
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Failed Delivery by Channel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">SMS</Badge>
                    <span className="font-semibold tabular-nums text-destructive">
                      45
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">WhatsApp</Badge>
                    <span className="font-semibold tabular-nums text-destructive">
                      46
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Logs Table */}
          <Card>
            <div className="flex items-center gap-2 border-b px-6 py-4">
              <Send className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Recent Message Logs
              </span>
              {meta?.total != null && (
                <Badge variant="outline" className="tabular-nums">
                  {meta.total}
                </Badge>
              )}
            </div>
            <CardContent className="p-0">
              <DemoTable table={table} />
              <div className="p-4 border-t">
                <CustomPagination
                  meta={meta || { total: 0, currentPage: 0 }}
                  handleNextPage={setNextPage}
                  handlePrevPage={setPrevPage}
                  handlePageSizeChange={setPerPage}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={meta?.total}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
