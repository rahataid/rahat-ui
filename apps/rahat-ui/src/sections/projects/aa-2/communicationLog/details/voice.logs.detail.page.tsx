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

import { useParams, useSearchParams } from 'next/navigation';
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

const communicationData = [
  {
    id: 1,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 2,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Failed',
  },
  {
    id: 3,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 4,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 5,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 6,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 7,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 8,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 9,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
  {
    id: 10,
    audience: '+977-9877577473',
    attempts: 1,
    timestamp: '21 July, 2025, 00:12:35 PM',
    duration: 12,
    status: 'Success',
  },
];

export default function VoiceLogsDetailPage() {
  const { id: projectID, commsIdXsessionId } = useParams();

  const [communicationId, sessionId] = (commsIdXsessionId as string).split(
    '%40',
  );

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backFrom = searchParams.get('backFrom');

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);

  const columns = useCommsLogsTableColumns('voice');
  const cleanFilters = Object.fromEntries(
    Object.entries(debounceSearch).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined,
    ),
  );

  const { data: sessionLogs, isLoading: isLoadingSessionLogs } =
    useListSessionLogs(sessionId, {
      ...pagination,
      ...cleanFilters,
    });
  console.log('sessionLogs', sessionLogs);

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

  const table = useReactTable({
    manualPagination: true,
    data: communicationData,
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

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {' '}
      {/* Updated wrapper div */}
      <div className="p-4 max-w-full overflow-x-hidden">
        <div className="flex flex-col space-y-0">
          <Back />

          <div className="mt-1 flex flex-col pb-1 gap-2">
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <Heading
                title={`Communication Details`}
                description="Here is the detailed view of selected communication"
              />
              <div className="flex gap-2 flex-col md:flex-row">
                <Button variant="outline" className="gap-2 h-7">
                  <CloudDownload className="h-3.5 w-3.5" />
                  Failed Exports Attempts
                </Button>
                <Button
                  type="button"
                  onClick={retryFailed}
                  className="gap-2 h-7"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Retry Failed Requests
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap gap-8 w-full">
              <div className="w-full md:w-auto md:max-w-[788px]">
                <Card className="p-4 rounded-lg border bg-white min-h-[170px] w-full">
                  <div className="flex gap-6 pb-2">
                    <Badge className="bg-blue-100 text-blue-600 px-3 py-1 text-sm font-medium">
                      Preparedness
                    </Badge>
                    <Badge className="rounded-xl capitalize text-xs font-normal bg-green-100 text-green-600 px-3 py-1">
                      Not Started
                    </Badge>
                  </div>
                  <CardContent className="pl-1 pb-1 font-semibold flex flex-col gap-6">
                    <Label className="text-muted-foreground text-xs">
                      Activity Title:
                    </Label>
                    <Label className="text-base space-y-1 font-semibold">
                      Distribute educational materials about the anticipatory
                      action plan to local communities
                    </Label>
                  </CardContent>
                  <CardFooter className="pl-1 pb-2 text-sm text-muted-foreground">
                    Korem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc vulputate libero
                  </CardFooter>
                </Card>
              </div>
              <div className="flex-[1] lg:max-w-[35%]">
                <div className="flex flex-row gap-4">
                  <DataCard
                    title="Successfully Delivered"
                    smallNumber="10"
                    className="rounded-[12px] border p-4 flex-1"
                  />
                  <DataCard
                    title="Failed Delivered"
                    smallNumber="2"
                    className="rounded-[12px] border p-4 flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="w-full col-span-1 bg-white rounded-sm">
                <CardContent className="p-6 space-y-6">
                  {/* Beneficiary Group */}
                  <div>
                    <p className="text-sm text-gray-500">Beneficiary Group</p>
                    <p className="font-medium">Static Group Name</p>
                  </div>

                  {/* Triggered Date */}
                  <div>
                    <p className="text-sm text-gray-500">Triggered Date</p>
                    <p className="font-medium">21 July, 2025</p>
                  </div>

                  {/* Total Audience */}
                  <div>
                    <p className="text-sm text-gray-500">Total Audience</p>
                    <p className="font-medium">50</p>
                  </div>

                  {/* Completed At */}
                  <div>
                    <p className="text-sm text-gray-500">Completed At</p>
                    <p className="font-medium">22 July, 2025</p>
                  </div>

                  {/* VOICE Status */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full">
                        <Mic />
                      </div>
                      <span className="font-medium">Voice</span>
                    </div>
                    <Badge className="bg-green-100 text-green-600 rounded-full px-3 ml-auto">
                      Completed
                    </Badge>
                  </div>

                  {/* Communication */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Communication</p>
                    <div className="relative w-full max-w-[350px] h-[78px] opacity-100 p-2 rounded-[16px] border border-gray-300 flex flex-col items-center justify-center gap-2">
                      <p className="font-inter text-sm text-gray-700 font-normal leading-4 tracking-normal text-center px-2 py-1 rounded truncate">
                        Audiorecord.mp3
                      </p>
                      <audio
                        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                        //controls
                        className="w-full rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1 md:col-span-2 w-full rounded-sm">
                <CardHeader className="flex flex-row items-center justify-center gap-2 pb-0 pt-0.5 space-y-0 px-2">
                  <SearchInput
                    className="w-full max-w-[500px]"
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
                    meta={{
                      total: 12,
                      currentPage: 1,
                      lastPage: 2,
                      perPage: 10,
                      next: 2,
                      prev: null,
                    }}
                    handleNextPage={setNextPage}
                    handlePrevPage={setPrevPage}
                    handlePageSizeChange={setPerPage}
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    total={2}
                  />
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
