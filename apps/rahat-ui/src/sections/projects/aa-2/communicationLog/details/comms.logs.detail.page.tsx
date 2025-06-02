import {
  useGetCommunicationLogs,
  useListSessionLogs,
  usePagination,
  useRetryFailedBroadcast,
  useSingleActivity,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
// import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import { UUID } from 'crypto';
import {
  AudioLines,
  CloudDownload,
  Component,
  Download,
  Hash,
  LucideIcon,
  Mail,
  MessageSquareMore,
  MessageSquareWarning,
  RefreshCcw,
  Text,
  Timer,
  UsersRound,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { Player } from 'react-simple-player';
import useCommsLogsTableColumns from '../table/useCommsLogsTableColumns';
import {
  Back,
  CustomPagination,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import CommsLogsTable from '../table/comms.logs.table';
import CardSkeleton from 'apps/rahat-ui/src/common/cardSkeleton';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import * as XLSX from 'xlsx';
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

  const columns = useCommsLogsTableColumns();

  // logs?.sessionLogs

  const { data: logs, isLoading } = useGetCommunicationLogs(
    projectID as UUID,
    communicationId,
    activityId,
  );

  const { data: activityDetail, isLoading: isLoadingActivity } =
    useSingleActivity(projectID as UUID, activityId);
  const { data: sessionLogs, isLoading: isLoadingSessionLogs } =
    useListSessionLogs(sessionId, { ...pagination, ...filters });

  const logsMeta = sessionLogs?.httpReponse?.data?.meta;

  const mutateRetry = useRetryFailedBroadcast(
    projectID as UUID,
    communicationId,
    activityId,
  );

  const retryFailed = async () => {
    mutateRetry.mutateAsync();
  };

  const failedCount = useMemo(() => {
    return (
      sessionLogs?.httpReponse?.data?.data?.filter(
        (log: any) => log?.status === BroadcastStatus.FAIL,
      ) ?? []
    );
  }, [sessionLogs]);

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

  // if (isLoading || isLoadingSessionLogs) {
  //   return <Loader />;
  // }

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

            <Button
              variant="outline"
              className=" gap-2"
              onClick={onFailedExports}
              disabled={failedCount.length === 0}
            >
              Failed Exports
              <CloudDownload className="h-4 w-4" />
            </Button>
          </div>
          {isLoadingActivity ? (
            <CardSkeleton />
          ) : (
            <Card className="p-4 rounded-sm bg-white">
              <CardTitle className="flex gap-2 pb-2">
                <Badge>{activityDetail?.phase?.name}</Badge>
                <Badge
                  className={`rounded-xl capitalize text-xs font-normal ${getStatusBg(
                    activityDetail?.status,
                  )}`}
                >
                  {activityDetail?.status
                    .toLowerCase()
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Badge>
              </CardTitle>
              <CardContent className="pl-1 pb-1 text-xl font-semibold ">
                {activityDetail?.title}
              </CardContent>
              <CardFooter className="pl-1 pb-2 text-sm text-muted-foreground">
                {activityDetail?.description}
              </CardFooter>
            </Card>
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
                    {renderDateTime(logs?.sessionDetails?.createdAt)}
                  </p>
                </div>

                {/* Total Audience */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Audience</p>
                  <p className="font-medium">{logsMeta?.total}</p>
                </div>

                {/* IVR Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {logs?.sessionDetails?.Transport?.name === 'IVR' ? (
                        <AudioLines />
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
                  name="audience"
                  className="w-full"
                  value={
                    (table.getColumn('audience')?.getFilterValue() as string) ??
                    filters?.audience
                  }
                  onSearch={(event) => handleFilterChange(event)}
                />
                <SelectComponent
                  name="Status"
                  options={['ALL', 'SUCCESS', 'PENDING', 'FAILED']}
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

function renderDateTime(dateTime: string) {
  if (dateTime) {
    const d = new Date(dateTime);
    const localeDate = d.toLocaleDateString();
    const localeTime = d.toLocaleTimeString();
    return `${localeDate} ${localeTime}`;
  }
  return 'N/A';
}

function renderMessage(message: any) {
  if (typeof message === 'string') {
    return message;
  }
  return (
    <div className="bg-gray-50 p-3 rounded-sm">
      <p className="text-center mb-2">{message?.fileName} </p>

      <audio src={message?.audioURL} controls className="w-full h-10 " />
    </div>
  );
}
