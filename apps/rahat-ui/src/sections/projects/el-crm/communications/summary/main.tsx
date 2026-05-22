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
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import DemoTable from 'apps/rahat-ui/src/components/table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import {
  useCustomerStats,
  useListElCrmCampaign,
  usePagination,
} from '@rahat-ui/query';
import { useMsgTableColumn } from '../messages/useMsgTableColumns';

const numberFormatter = new Intl.NumberFormat();

const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

type StatsRow = {
  name?: string;
  data?: unknown;
};

export default function SummaryView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const columns = useMsgTableColumn();

  const { data, meta } = useListElCrmCampaign(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
  });

  const { data: statsRows = [] } = useCustomerStats(projectUUID);

  const {
    totalMessagesSent,
    successfulMessages,
    failedMessages,
    skippedMessages,
    messagesToConsumers,
    messagesToCustomers,
    deliveryRate,
    topAudience,
  } = useMemo(() => {
    const statsByName: Record<string, unknown> = {};

    (Array.isArray(statsRows) ? statsRows : []).forEach((row: StatsRow) => {
      if (row?.name) {
        statsByName[row.name] = row.data;
      }
    });

    const getStatNumber = (name: string, fallback = 0) => {
      return toNumber(statsByName[name]) || fallback;
    };

    const sent = getStatNumber('TOTAL_MESSAGES_SUCCESS');
    const failed = getStatNumber('TOTAL_MESSAGES_FAILED');
    const total = getStatNumber('TOTAL_MESSAGES_SENT');
    const skipped = Math.max(total - sent - failed, 0);
    const consumers = getStatNumber('MESSAGES_TO_CONSUMERS');
    const customers = getStatNumber('MESSAGES_TO_CUSTOMERS');

    const rate = total > 0 ? Math.round((sent / total) * 100) : 0;

    return {
      totalMessagesSent: total,
      successfulMessages: sent,
      failedMessages: failed,
      skippedMessages: skipped,
      messagesToConsumers: consumers,
      messagesToCustomers: customers,
      deliveryRate: rate,
      topAudience:
        consumers === customers
          ? 'Balanced'
          : consumers > customers
          ? 'Consumers'
          : 'Customers',
    };
  }, [statsRows]);

  const table = useReactTable({
    manualPagination: true,
    data,
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
                value: numberFormatter.format(totalMessagesSent),
                icon: MessageSquare,
                color: 'text-primary',
                bgColor: 'bg-primary/5',
                iconColor: 'text-primary',
                tooltip: 'From stats table: TOTAL_MESSAGES_SENT',
              },
              {
                title: 'Delivery Successful',
                value: numberFormatter.format(successfulMessages),
                icon: CheckCircle,
                color: 'text-success',
                bgColor: 'bg-success/5',
                iconColor: 'text-success',
                tooltip: 'From stats table: TOTAL_MESSAGES_SUCCESS',
              },
              {
                title: 'Delivery Failed',
                value: numberFormatter.format(failedMessages),
                icon: XCircle,
                color: 'text-destructive',
                bgColor: 'bg-destructive/5',
                iconColor: 'text-destructive',
                tooltip: 'From stats table: TOTAL_MESSAGES_FAILED',
              },
              {
                title: 'Top Audience',
                value: topAudience,
                icon: Smartphone,
                color: 'text-foreground',
                bgColor: 'bg-muted',
                iconColor: 'text-muted-foreground',
                tooltip:
                  'Based on MESSAGES_TO_CONSUMERS vs MESSAGES_TO_CUSTOMERS',
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
                  Message Volume by Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Consumers</Badge>
                    <span className="font-semibold tabular-nums text-foreground">
                      {numberFormatter.format(messagesToConsumers)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Customers</Badge>
                    <span className="font-semibold tabular-nums text-foreground">
                      {numberFormatter.format(messagesToCustomers)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Delivery Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Sent</Badge>
                    <span className="font-semibold tabular-nums text-success">
                      {numberFormatter.format(successfulMessages)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Failed</Badge>
                    <span className="font-semibold tabular-nums text-destructive">
                      {numberFormatter.format(failedMessages)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Skipped</Badge>
                    <span className="font-semibold tabular-nums text-muted-foreground">
                      {numberFormatter.format(skippedMessages)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Delivery Rate</Badge>
                    <span className="font-semibold tabular-nums text-primary">
                      {deliveryRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="flex flex-col">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Recent Message Logs
                </span>
                {meta?.total != null && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {meta.total}
                  </span>
                )}
              </div>
            </div>
            <CardContent className="p-0">
              <DemoTable table={table} tableHeight="h-[calc(100vh-600px)]" />
              <CustomPagination
                meta={meta || { total: 0, currentPage: 0 }}
                handleNextPage={setNextPage}
                handlePrevPage={setPrevPage}
                handlePageSizeChange={setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={meta?.total}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
