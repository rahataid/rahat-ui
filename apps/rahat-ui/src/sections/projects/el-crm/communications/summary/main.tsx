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
  Info,
  TrendingUp,
  TrendingDown,
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

const statCards = [
  {
    label: 'Total Messages Sent',
    value: '1,247',
    icon: MessageSquare,
    iconColor: 'text-primary',
    valueColor: 'text-primary',
    tooltip: 'Total number of messages sent across all channels',
  },
  {
    label: 'Delivery Successful',
    value: '1,156',
    icon: CheckCircle,
    iconColor: 'text-success',
    valueColor: 'text-success',
    tooltip: 'Messages successfully delivered to recipients',
  },
  {
    label: 'Delivery Failed',
    value: '91',
    icon: XCircle,
    iconColor: 'text-destructive',
    valueColor: 'text-destructive',
    tooltip: 'Messages that failed to deliver',
  },
  {
    label: 'Most Used Channel',
    value: 'SMS',
    icon: Smartphone,
    iconColor: 'text-muted-foreground',
    valueColor: 'text-foreground',
    tooltip: 'The communication channel used most frequently',
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
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Communication Center
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Send messages and track communication logs
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
                >
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Message
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Compose a new message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-start gap-3">
                        <div className="rounded-md bg-muted p-2">
                          <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className={`text-2xl font-bold tabular-nums ${stat.valueColor}`}>
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{stat.tooltip}</TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Channel Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Successful Delivery by Channel
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">SMS</Badge>
                    <span className="font-semibold tabular-nums text-success">456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="success">WhatsApp</Badge>
                    <span className="font-semibold tabular-nums text-success">389</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Failed Delivery by Channel
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">SMS</Badge>
                    <span className="font-semibold tabular-nums text-destructive">34</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">WhatsApp</Badge>
                    <span className="font-semibold tabular-nums text-destructive">28</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Logs */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Message Logs
                </CardTitle>
                {meta?.total != null && (
                  <Badge variant="outline" className="ml-1 tabular-nums">
                    {meta.total}
                  </Badge>
                )}
              </div>
            </CardHeader>
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
