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
import { Label } from '@rahat-ui/shadcn/components/label';
import {
  ArrowLeft,
  CalendarDays,
  FilterX,
  Radio,
  RefreshCcw,
  Send,
  Users,
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
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import CommsLogsTable from '../../../../aa/communication-logs/comms.logs.table';
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

  const { data: logs } = useListElCrmSessionBroadcast(
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
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              The message you're looking for doesn't exist.
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button size="sm">Go Back to Messages</Button>
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
  const showRetryButton = failedCount > 0 || (count?.SCHEDULED ?? 0) > 0;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/el-crm/${projectUUID}/communications/messages`}
                  >
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back to messages</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {campaign.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View message details
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
          <div className="space-y-4 p-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Campaign Status
                    </Label>
                    <Badge variant={getStatusVariant(isSent ? 'Sent' : 'Draft')}>
                      {isSent ? 'Sent' : 'Draft'}
                    </Badge>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Message Name
                    </Label>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {campaign.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border bg-muted/30 p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        Recipients
                      </div>
                      <p className="font-semibold tabular-nums text-foreground">
                        {(campaign?.recipientCount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-3">
                      <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Created
                      </div>
                      <p className="font-semibold tabular-nums text-foreground">
                        {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                <DataCard
                  title="Successfully Delivered"
                  smallNumber={deliveredCount.toString()}
                  className="rounded-sm w-full h-24 pt-10 pb-8"
                />
                <DataCard
                  title="Failed Delivered"
                  smallNumber={failedCount.toString()}
                  className="rounded-sm w-full h-24 pt-10 pb-8"
                />
              </div>
            </div>

            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle>Message Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="space-y-5 lg:col-span-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Channel
                        </Label>
                        <div className="mt-2">
                          <Badge variant={getChannelVariant(campaign.transportName)}>
                            {campaign.transportName}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Group
                        </Label>
                        <p className="mt-2 text-sm font-medium text-foreground">
                          {campaign.targetType}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                        Message Content
                      </Label>
                      <Card className="mt-2">
                        <CardContent className="max-h-[320px] overflow-auto p-4">
                          <p className="whitespace-pre-wrap text-sm text-foreground">
                            {campaign.body}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Card className="rounded-sm lg:col-span-2">
                    <CardHeader className="space-y-3 border-b px-3 pb-3 pt-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-foreground">
                          Delivery Logs ({meta?.total || 0})
                        </Label>
                        {hasActiveFilters && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                          >
                            <FilterX className="mr-2 h-4 w-4" />
                            Reset Filters
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
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
                      <CommsLogsTable table={table} />
                    </CardContent>

                    <CardFooter className="justify-end border-t p-4">
                      <CustomPagination
                        meta={meta}
                        handleNextPage={setNextPage}
                        handlePrevPage={setPrevPage}
                        handlePageSizeChange={setPerPage}
                        currentPage={pagination.page}
                        perPage={pagination.perPage}
                        total={meta?.total}
                      />
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
