'use client';

import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FilterX,
  Hash,
  MessageSquareText,
  RefreshCcw,
  Send,
  Signal,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { UUID } from 'crypto';
import {
  useGetElCrmCampaign,
  useTriggerElCrmCampaign,
  useListElCrmBroadCastCount,
  useListElCrmSessionBroadcast,
  usePagination,
  useRetryFailedSession,
} from '@rahat-ui/query';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import SearchInput from '../../../../components/search.input';
import SelectComponent from '../../../../cambodia/select.component';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import useCommsLogsTableColumns from '../../useCommsLogsTableColumns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import DemoTable from 'apps/rahat-ui/src/components/table';

export default function MessageDetailPage() {
  const { id: projectUUID, messageId } = useParams() as {
    id: UUID;
    messageId: string;
  };
  const { data: campaign, isLoading } = useGetElCrmCampaign(
    projectUUID,
    messageId,
  );
  const { data: count } = useListElCrmBroadCastCount(
    projectUUID,
    {
      sessionId: campaign?.sessionId || '',
    },
    {
      queryKey: ['elCrmBroadCastCount', projectUUID, campaign?.sessionId],
      enabled: !!campaign?.sessionId,
    },
  );

  const mutateRetry = useRetryFailedSession(projectUUID);

  const retryFailed = async () => {
    try {
      const res = await mutateRetry.mutateAsync(campaign?.sessionId || '');
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const columns = useCommsLogsTableColumns();
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  const { data: logs, isLoading: isLogsLoading } = useListElCrmSessionBroadcast(
    projectUUID,
    {
      session: campaign?.sessionId || '',
      ...pagination,
      ...filters,
    },
    {
      queryKey: ['elCrmBroadCastCount', projectUUID, campaign?.sessionId],
      enabled: !!campaign?.sessionId,
    },
  );

  // Calculate total price from logs
  const totalPrice = React.useMemo(() => {
    if (!logs?.data) return 0;
    return logs.data.reduce((sum: number, log: any) => {
      let price = log?.disposition?.price;
      if (typeof price === 'string' && price.startsWith('-')) {
        price = price.substring(1);
      }
      const num = parseFloat(price);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }, [logs]);

  const table = useReactTable({
    manualPagination: true,
    data: logs?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters],
  );

  const trigger = useTriggerElCrmCampaign(projectUUID);

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
      default:
        return 'secondary';
    }
  };

  const handleSendMessage = () => {
    console.log('Sending message:', campaign?.uuid);
    trigger.mutate({ uuid: campaign?.uuid || '' });
  };

  const hasActiveFilters = Object.values(filters || {}).some(
    (value) => value !== undefined && value !== null && value !== '',
  );

  const clearAllFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (!campaign) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Message Not Found
            </h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="rounded-full bg-muted/50 p-4 mx-auto w-fit">
              <MessageSquareText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              The message you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button size="sm" variant="outline" className="mt-2">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back to Messages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev: any) => {
      const updated = { ...prev };

      if (value === 'ALL') delete updated[name];
      else updated[name] = value;

      return updated;
    });

    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const meta = logs?.response.meta || { total: 0, currentPage: 0 };
  const isSent = !!campaign.sessionId;
  const deliveredCount = count?.SUCCESS ?? 0;
  const failedCount = count?.FAIL ?? 0;
  const totalRecipients = campaign?.recipientCount || 0;
  const deliveryRate =
    totalRecipients > 0
      ? Math.round((deliveredCount / totalRecipients) * 100)
      : 0;
  const showRetryButton = failedCount > 0 || (count?.SCHEDULED ?? 0) > 0;

  const statCards = [
    {
      title: 'Successfully Delivered',
      value: deliveredCount.toLocaleString(),
      subtitle:
        totalRecipients > 0 ? `${deliveryRate}% delivery rate` : undefined,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      valueColor: 'text-emerald-700',
    },
    {
      title: 'Failed Delivery',
      value: failedCount.toLocaleString(),
      subtitle:
        totalRecipients > 0
          ? `${Math.round((failedCount / totalRecipients) * 100)}% failure rate`
          : undefined,
      icon: XCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-500/10',
      valueColor: failedCount > 0 ? 'text-red-700' : 'text-foreground',
    },
    {
      title: 'Total Cost',
      value: `$${totalPrice.toFixed(4)}`,
      // subtitle:
      //   totalRecipients > 0
      //     ? `~$${(totalPrice / totalRecipients).toFixed(4)}/msg`
      //     : undefined,
      icon: CircleDollarSign,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      valueColor: 'text-foreground',
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* ── Header ── */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/el-crm/${projectUUID}/communications/messages`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 mt-0.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back to messages</TooltipContent>
              </Tooltip>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h1 className="text-lg font-semibold tracking-tight text-foreground line-clamp-1">
                        {campaign.name}
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      className="max-w-sm"
                    >
                      <p className="text-sm">{campaign.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge
                    variant={getStatusVariant(isSent ? 'Sent' : 'Draft')}
                    className="shrink-0"
                  >
                    {isSent ? 'Sent' : 'Draft'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    {totalRecipients.toLocaleString()} recipients
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" />
                    {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Signal className="h-3 w-3" />
                    {campaign.transportName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {showRetryButton && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={retryFailed}
                      className="gap-2"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Retry Failed
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Retry all failed deliveries</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    disabled={isSent}
                    onClick={handleSendMessage}
                    className="gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Message
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isSent ? 'Message already sent' : 'Send this message now'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[104px] rounded-lg" />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Skeleton className="h-[380px] rounded-lg" />
              <Skeleton className="h-[380px] rounded-lg lg:col-span-2" />
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {/* ── KPI Strip ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {statCards.map((stat) => (
                <Card
                  key={stat.title}
                  className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground leading-none truncate">
                          {stat.title}
                        </p>
                        <p
                          className={`text-2xl font-bold tracking-tight tabular-nums ${stat.valueColor}`}
                        >
                          {stat.value}
                        </p>
                        {stat.subtitle && (
                          <p className="text-[11px] text-muted-foreground leading-tight">
                            {stat.subtitle}
                          </p>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-2 ${stat.bgColor} shrink-0`}
                      >
                        <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── Content: Message Details + Delivery Logs ── */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Message Details Sidebar */}
              <Card className="overflow-hidden lg:col-span-1 self-start">
                <CardHeader className="border-b px-5 py-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <div className="rounded-md bg-primary/10 p-1.5">
                      <MessageSquareText className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Message Details
                  </CardTitle>
                </CardHeader>

                <div className="divide-y divide-border">
                  {/* Channel */}
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Channel
                    </span>
                    <Badge variant={getChannelVariant(campaign.transportName)}>
                      {campaign.transportName}
                    </Badge>
                  </div>

                  {/* Target Group */}
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Group
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {campaign.targetType}
                    </span>
                  </div>

                  {/* Recipients */}
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Recipients
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {totalRecipients.toLocaleString()}
                    </span>
                  </div>

                  {/* Delivery Rate */}
                  {isSent && (
                    <div className="px-5 py-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Delivery Rate
                        </span>
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            deliveryRate >= 80
                              ? 'text-emerald-600'
                              : deliveryRate >= 50
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {deliveryRate}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            deliveryRate >= 80
                              ? 'bg-emerald-500'
                              : deliveryRate >= 50
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(deliveryRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="px-5 py-4">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Message Content
                    </span>
                    <div className="mt-2.5 rounded-lg border border-border/60 bg-muted/30 p-4 max-h-[280px] overflow-auto">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                        {campaign.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Delivery Logs */}
              <Card className="overflow-hidden lg:col-span-2">
                <CardHeader className="space-y-3 border-b px-5 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <div className="rounded-md bg-primary/10 p-1.5">
                        <Hash className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Delivery Logs
                      <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                        {meta?.total || 0}
                      </span>
                    </CardTitle>
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={clearAllFilters}
                      >
                        <FilterX className="mr-1.5 h-3.5 w-3.5" />
                        Clear
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
                    <div className="md:col-span-3">
                      <SearchInput
                        value={filters.address}
                        name="Audience"
                        onSearch={(e) => handleSearch(e, 'address')}
                      />
                    </div>

                    <div className="md:col-span-1 !mt-0">
                      <SelectComponent
                        name="Status"
                        options={['ALL', 'SUCCESS', 'PENDING', 'FAIL']}
                        onChange={(value) =>
                          handleFilterChange('status', value)
                        }
                        value={filters?.status ?? 'ALL'}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <DemoTable
                    table={table}
                    loading={isLogsLoading}
                    tableHeight="h-[calc(100vh-535px)]"
                  />
                  <CustomPagination
                    meta={meta}
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
        )}
      </div>
    </TooltipProvider>
  );
}
