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
import { ArrowLeft, Send } from 'lucide-react';
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

  const { data: logs } = useListElCrmSessionBroadcast(
    projectUUID,
    {
      session: campaign?.sessionId || '',
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
  const table = useReactTable({
    manualPagination: true,
    data: logs || [],
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!campaign) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
            >
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Message Not Found
              </h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              The message you're looking for doesn't exist.
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button>Go Back to Messages</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  console.log('Session Logs:', logs);

  // logs?.sessionDetails?.Transport?.name,

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue = value === 'ALL' ? '' : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          <div>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {campaign.name}
              </h1>
              <p className="text-muted-foreground">View message details</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Left Section  — 1/3 on large screens */}
          <div className="flex-[2]">
            <Card className="p-4 rounded-sm bg-white h-full">
              <CardTitle className="flex gap-2 pb-2">
                <Badge
                  className={getStatusColor(
                    campaign.sessionId ? 'Sent' : 'Draft',
                  )}
                >
                  {campaign.sessionId ? 'Sent' : 'Draft'}
                </Badge>
              </CardTitle>
              <CardContent className="pl-1 pb-1  font-semibold flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">
                  Message Name:
                </Label>
                <Label className="text-base space-y-1 font-semibold">
                  {campaign?.name}
                </Label>
              </CardContent>
            </Card>
          </div>

          {/* Right Section (Data Cards) — 2/3 on large screens */}
          <div className=" flex-1 flex flex-wrap gap-4">
            <DataCard
              title="Successfully Delivered"
              smallNumber={(count?.SUCCESS ?? 0).toString()}
              className="rounded-sm w-full h-20 pt-10 pb-8"
            />
            <DataCard
              title="Failed Delivered"
              smallNumber={(count?.FAIL ?? 0).toString()}
              className="rounded-sm w-full h-20 pt-10 pb-8"
            />
          </div>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="grid gap-6">
          {/* Message Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Message Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT DETAILS SECTION */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex justify-between">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Channel
                      </Label>
                      <div className="mt-2">
                        <Badge
                          className={getChannelColor(campaign.transportName)}
                          variant="secondary"
                        >
                          {campaign.transportName}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Group
                      </Label>
                      <p className="text-sm mt-2">{campaign.targetType}</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Recipients
                      </Label>
                      <p className="text-sm mt-2">{logs?.length || 0}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created Date
                      </Label>
                      <p className="text-sm mt-2">
                        {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Message Content
                      </Label>
                      <Card className="mt-2">
                        <CardContent className="p-4">
                          <p className="text-sm whitespace-pre-wrap">
                            {campaign.body}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* RIGHT TABLE SECTION */}
                <Card className="lg:col-span-2 rounded-sm">
                  <CardHeader className="flex flex-row items-center gap-3 pb-0 pt-2 px-3">
                    <SearchInput
                      className="flex-1"
                      value={filters.address}
                      name="Audience"
                      onSearch={(e) => handleSearch(e, 'address')}
                    />

                    <SelectComponent
                      name="Status"
                      options={['ALL', 'SUCCESS', 'PENDING', 'FAIL']}
                      onChange={(value) =>
                        handleFilterChange({
                          target: { name: 'status', value },
                        })
                      }
                      value={filters?.status || ''}
                    />
                  </CardHeader>

                  <CardContent className="px-3">
                    <CommsLogsTable table={table} />
                  </CardContent>

                  <CardFooter className="justify-end">
                    <CustomPagination
                      meta={{
                        total: 0,
                        currentPage: 0,
                        lastPage: 0,
                        perPage: 0,
                        next: null,
                        prev: null,
                      }}
                      handleNextPage={setNextPage}
                      handlePrevPage={setPrevPage}
                      handlePageSizeChange={setPerPage}
                      currentPage={pagination.page}
                      perPage={pagination.perPage}
                      total={0}
                    />
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
