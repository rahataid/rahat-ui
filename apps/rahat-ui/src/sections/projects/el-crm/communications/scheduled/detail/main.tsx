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
import { ArrowLeft, Send, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import Link from 'next/link';
import { format } from 'date-fns';
import { UUID } from 'crypto';
import {
  useGetElCrmCampaign,
  useTriggerElCrmCampaign,
  useListElCrmBroadCastCount,
  useListElCrmSessionBroadcast,
  usePagination,
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
      ...filters,
      ...pagination,
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
    [filters],
  );

  const trigger = useTriggerElCrmCampaign(projectUUID);

  const getChannelVariant = (channel: string): 'default' | 'secondary' | 'outline' => {
    switch (channel) {
      case 'SMS':
        return 'default';
      case 'WhatsApp':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'secondary' => {
    switch (status) {
      case 'Sent':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (!campaign) {
    return (
      <TooltipProvider delayDuration={200}>
        <div className="flex flex-col h-full">
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back to scheduled messages</TooltipContent>
              </Tooltip>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Message Not Found
              </h1>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="rounded-full bg-muted p-4 mx-auto mb-4 w-fit">
                <Info className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The message you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link
                href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
              >
                <Button size="sm">Go Back to Messages</Button>
              </Link>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }
  console.log('Session Logs:', logs);

  // logs?.sessionDetails?.Transport?.name,

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

  return (
    <TooltipProvider delayDuration={200}>
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Back to scheduled messages</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {campaign.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">View message details</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 w-full p-6">
          {/* Left Section — status & name */}
          <div className="flex-[2]">
            <Card className="h-full">
              <CardContent className="p-5 flex flex-col gap-3">
                <Badge
                  variant={getStatusVariant(
                    campaign.sessionId ? 'Sent' : 'Draft',
                  )}
                  className="w-fit"
                >
                  {campaign.sessionId ? 'Sent' : 'Draft'}
                </Badge>
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Message Name
                  </Label>
                  <p className="text-base font-semibold mt-1">
                    {campaign?.name || '\u2014'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section — delivery stats */}
          <div className="flex-1 flex flex-wrap gap-4">
            <DataCard
              title="Successfully Delivered"
              smallNumber={(count?.SUCCESS ?? 0).toString()}
              className="w-full h-20 pt-10 pb-8"
            />
            <DataCard
              title="Failed Delivered"
              smallNumber={(count?.FAIL ?? 0).toString()}
              className="w-full h-20 pt-10 pb-8"
            />
          </div>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="grid gap-6">
          {/* Message Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT DETAILS SECTION */}
                <div className="lg:col-span-1 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Channel
                      </Label>
                      <div className="mt-1.5">
                        <Badge variant={getChannelVariant(campaign.transportName)}>
                          {campaign.transportName || '\u2014'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Group
                      </Label>
                      <p className="text-sm mt-1.5">{campaign.targetType || '\u2014'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Recipients
                      </Label>
                      <p className="text-sm mt-1.5 tabular-nums">
                        {logs?.length || 0}
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Created Date
                      </Label>
                      <p className="text-sm mt-1.5 tabular-nums">
                        {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Message Content
                    </Label>
                    <Card className="mt-1.5 bg-muted/50">
                      <CardContent className="p-4">
                        <p className="text-sm whitespace-pre-wrap">
                          {campaign.body || '\u2014'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* RIGHT TABLE SECTION */}
                <Card className="lg:col-span-2 rounded-lg">
                  <CardHeader className="grid grid-cols-4 gap-3 pb-0 pt-2 px-3">
                    <div className="col-span-3">
                      <SearchInput
                        value={filters.address}
                        name="Audience"
                        onSearch={(e) => handleSearch(e, 'address')}
                      />
                    </div>

                    <div className="col-span-1 !mt-0">
                      <SelectComponent
                        name="Status"
                        options={['ALL', 'SUCCESS', 'PENDING', 'FAIL']}
                        onChange={(value) =>
                          handleFilterChange('status', value)
                        }
                        value={filters?.status ?? 'ALL'}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="px-3">
                    <CommsLogsTable table={table} />
                  </CardContent>

                  <CardFooter className="justify-end">
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
      </div>
    </div>
    </TooltipProvider>
  );
}
