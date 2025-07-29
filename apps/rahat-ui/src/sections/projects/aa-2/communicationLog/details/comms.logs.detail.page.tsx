import {
  useGetCommunicationLogs,
  useListSessionLogs,
  usePagination,
  useRetryFailedBroadcast,
  useSessionBroadCastCount,
  useSessionRetryFailed,
  useSingleActivity,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
// import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Back,
  CustomPagination,
  DataCard,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import CardSkeleton from 'apps/rahat-ui/src/common/cardSkeleton';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { UUID } from 'crypto';
import {
  AudioLines,
  CloudDownload,
  LucideIcon,
  Mail,

  RefreshCcw,

  Mic,

  Text,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import CommsLogsTable from '../table/comms.logs.table';
import useCommsLogsTableColumns from '../table/useCommsLogsTableColumns';
import { getPhaseColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
type IHeadCardProps = {
  title: string;
  icon: LucideIcon;
  content: string;
};

export default function CommsLogsDetailPage() {
  const { id: projectID, commsIdXactivityIdXsessionId } = useParams();
  const [communicationId, activityId, sessionId] = (
    commsIdXactivityIdXsessionId as string
  ).split('%40');

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  // logs?.sessionLogs
  const debounceSearch = useDebounce(filters, 500);
  const { data: logs, isLoading } = useGetCommunicationLogs(
    projectID as UUID,
    communicationId,
    activityId,
  );
  const columns = useCommsLogsTableColumns(
    logs?.sessionDetails?.Transport?.name,
  );
  const cleanFilters = Object.fromEntries(
    Object.entries(debounceSearch).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined,
    ),
  );
  const { data: activityDetail, isLoading: isLoadingActivity } =
    useSingleActivity(projectID as UUID, activityId);
  const { data: sessionLogs, isLoading: isLoadingSessionLogs } =
    useListSessionLogs(sessionId, { ...pagination, ...cleanFilters });

  const logsMeta = sessionLogs?.httpReponse?.data?.meta;

  const count = useSessionBroadCastCount([sessionId]);
  const mutateRetry = useSessionRetryFailed();

  const retryFailed = async () => {
    try {
      const res = await mutateRetry.mutateAsync({
        cuid: sessionId,
        includeFailed: true,
      });
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const logsGroupName = useMemo(() => {
    if (logs?.groupName.length > 20) {
      return `${logs?.groupName?.slice(0, 20)}...`;
    } else {
      return logs?.groupName;
    }
  }, [logs]);

  const table = useReactTable({
    manualPagination: true,
    data: sessionLogs?.httpReponse?.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

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

  const onFailedExports = () => {
    const logs = sessionLogs?.httpReponse?.data?.data?.filter(
      (log: any) => log?.status === BroadcastStatus.FAIL,
    );

    if (!logs?.length) return;

    const rowsToDownload = logs || [];
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((log: any) => ({
      Address: log.address,
      Status: log.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FailedLogs');

    XLSX.writeFile(workbook, 'CommunicationFailed.xlsx');
  };

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back
          path={`/projects/aa/${projectID}/communication-logs/details/${activityId}`}
        />

        <div className="mt-1 flex flex-col pb-1 gap-2">
          <div className="flex justify-between">
            <Heading
              title={`Communication Details`}
              description="Here is the detailed view of selected communication"
            />
            <div className="flex gap-2 flex-col md:flex-row">
              <Button
                variant="outline"
                className=" gap-2 h-7"
                onClick={onFailedExports}
                disabled={count?.data?.data?.FAIL === 0}
              >
                <CloudDownload className="h-3.5 w-3.5" />
                Failed Exports Attempts
              </Button>
              {count?.data?.data &&
                count?.data?.data?.FAIL > 0 &&
                logs?.sessionDetails?.Transport?.name === 'VOICE' && (
                  <Button
                    type="button"
                    onClick={retryFailed}
                    disabled={
                      mutateRetry.isPending
                      // logs?.sessionDetails?.maxAttempts === 3
                    }
                    className=" gap-2 h-7"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Retry Failed Requests
                  </Button>
                )}
            </div>
          </div>
          {isLoadingActivity ? (
            <CardSkeleton />
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 w-full">
              {/* Left Section (Activity Card) — 1/3 on large screens */}
              <div className="flex-[2]">
                <Card className="p-4 rounded-sm bg-white h-full">
                  <CardTitle className="flex gap-2 pb-2">
                    <Badge
                      className={`${getPhaseColor(
                        activityDetail?.phase?.name,
                      )}`}
                    >
                      {activityDetail?.phase?.name}
                    </Badge>
                    <Badge
                      className={`rounded-xl capitalize text-xs font-normal ${getStatusBg(
                        activityDetail?.status,
                      )}`}
                    >
                      {activityDetail?.status
                        .toLowerCase()
                        .split('_')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </Badge>
                  </CardTitle>
                  <CardContent className="pl-1 pb-1  font-semibold flex flex-col gap-1">
                    <Label className="text-muted-foreground text-xs">
                      Activity Title:
                    </Label>
                    <Label className="text-base space-y-1 font-semibold">
                      {activityDetail?.title}
                    </Label>
                  </CardContent>
                  <CardFooter className="pl-1 pb-2 text-sm text-muted-foreground">
                    {activityDetail?.description}
                  </CardFooter>
                </Card>
              </div>

              {/* Right Section (Data Cards) — 2/3 on large screens */}
              <div className=" flex-1 flex flex-wrap gap-4">
                <DataCard
                  title="Successfully Delivered"
                  smallNumber={(count?.data?.data?.SUCCESS ?? 0).toString()}
                  className="rounded-sm w-full h-20 pt-4"
                />
                <DataCard
                  title="Failed Delivered"
                  smallNumber={(count?.data?.data?.FAIL ?? 0).toString()}
                  className="rounded-sm w-full h-20 pt-4"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
            <Card className="w-full col-span-1 bg-white rounded-sm">
              <CardContent className="p-6 space-y-6">
                {/* Beneficiary Group */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {logs?.communicationDetail?.groupType
                      ? logs?.communicationDetail?.groupType + ' ' + 'GROUP'
                      : 'N/A'}
                  </p>
                  <p className="font-medium">{logsGroupName}</p>
                </div>

                {/* Triggered Date */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Triggered Date</p>
                  <p className="font-medium">
                    {dateFormat(logs?.sessionDetails?.createdAt)}
                  </p>
                </div>

                {/* Total Audience */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Audience</p>
                  <p className="font-medium">{logsMeta?.total}</p>
                </div>

                {/* VOICE Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {logs?.sessionDetails?.Transport?.name === 'VOICE' ? (
                        <Mic />
                      ) : logs?.sessionDetails?.Transport?.name === 'EMAIL' ? (
                        <Mail />
                      ) : (
                        <Text />
                      )}
                    </div>
                    <span className="font-medium">
                      {logs?.sessionDetails?.Transport?.name}
                    </span>
                  </div>

                  <Badge
                    className={`${
                      logs?.sessionDetails?.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-600 hover:bg-green-100'
                        : logs?.sessionDetails?.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-100'
                        : 'bg-red-100 text-red-600 hover:bg-red-100'
                    } rounded-full px-3`}
                  >
                    {logs?.sessionDetails?.status}
                  </Badge>
                </div>

                {/* Communication */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Communication</p>
                  {renderMessage(logs?.communicationDetail?.message)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 w-full rounded-sm">
              <CardHeader className="flex flex-row items-center justify-center gap-2 pb-0 pt-0.5 space-y-0 px-2">
                <SearchInput
                  className="w-full"
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
              <CardContent className="pt-0 pb-0 px-2">
                <CommsLogsTable
                  table={table}
                  isLoading={isLoadingSessionLogs}
                />
              </CardContent>
              <CardFooter className="justify-end pt-0 pb-0">
                <CustomPagination
                  meta={
                    logsMeta || {
                      total: 0,
                      currentPage: 0,
                      lastPage: 0,
                      perPage: 0,
                      next: null,
                      prev: null,
                    }
                  }
                  handleNextPage={setNextPage}
                  handlePrevPage={setPrevPage}
                  handlePageSizeChange={setPerPage}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={logsMeta?.lastPage || 0}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderMessage(message: any) {
  console.log(message);
  if (typeof message === 'string') {
    return message;
  }
  return (
    <div className="bg-gray-50 p-3 rounded-sm">
      <p className="text-center mb-2">{message?.fileName} </p>

      <audio src={message?.mediaURL} controls className="w-full h-10 " />
    </div>
  );
}
