import {
  useGetCommunicationLogs,
  useListSessionLogs,
  usePagination,
  useRetryFailedBroadcast,
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
  Component,
  Download,
  Hash,
  LucideIcon,
  MessageSquareMore,
  MessageSquareWarning,
  RefreshCcw,
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

  console.log('comms', communicationId);
  console.log('act', activityId);
  console.log('Session', sessionId);

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
    return logs?.sessionLogs?.filter(
      (log: any) => log?.status === BroadcastStatus.FAIL,
    )?.length;
  }, [logs]);

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

  const headCardFields = [
    {
      title: 'Total Audience',
      icon: Hash,
      content: logsMeta?.total || 'N/A',
    },
    {
      title: 'Triggered At',
      icon: Timer,
      content: renderDateTime(logs?.sessionDetails?.createdAt),
    },
    {
      title: 'Group Name',
      icon: UsersRound,
      content: logsGroupName || 'N/A',
    },
    {
      title: 'Group Type',
      icon: Component,
      content: logs?.communicationDetail?.groupType || 'N/A',
    },
    {
      title: 'Status',
      icon: MessageSquareWarning,
      content: (
        <Badge className="bg-orange-100 text-orange-600">
          {logs?.sessionDetails?.status}
        </Badge>
      ),
    },
  ];

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

  if (isLoading || isLoadingSessionLogs) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/communication-logs`} />

        <div className="mt-1 flex flex-col pb-1 gap-2">
          <div className="flex justify-between">
            <Heading
              title={`Communication Details`}
              description="Here is the detailed view of selected communication"
            />

            <Button type="button">
              <Download className="mr-2" size={16} strokeWidth={2} />
              <span className="font-normal">Failed Exports</span>
            </Button>
          </div>
          <Card className="p-4 rounded-sm bg-white">
            <CardTitle className="flex gap-2 pb-2">
              <Badge>Preparedness</Badge>
              <Badge>Not Started</Badge>
            </CardTitle>
            <CardContent className="pl-1 pb-1 text-xl font-semibold ">
              Distributed educational materials about the aa plan to local
              communities
            </CardContent>
            <CardFooter className="pl-1 pb-2 text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
              accusamus, nemo ad sequi ea maxime quidem deserunt eum est.
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
            <Card className="w-full col-span-1 bg-white rounded-sm">
              <CardContent className="p-6 space-y-6">
                {/* Beneficiary Group */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {logs?.communicationDetail?.groupType || 'N/A'}
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
                      <AudioLines />
                    </div>
                    <span className="font-medium">IVR</span>
                  </div>
                  <Badge className="bg-green-100 text-green-600 hover:bg-green-100 rounded-full px-3">
                    {logs?.sessionDetails?.status}
                  </Badge>
                </div>

                {/* Communication */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Communication</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-center mb-2">Audiorecord.mp4</p>

                    <audio
                      src={
                        'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR'
                      }
                      controls
                      className="w-full h-10 "
                    />
                  </div>
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
                  options={[
                    'ALL',
                    'NOT_STARTED',
                    'WORK_IN_PROGRESS',
                    'COMPLETED',
                    'DELAYED',
                  ]}
                  onChange={(value) =>
                    handleFilterChange({
                      target: { name: 'status', value },
                    })
                  }
                  value={filters?.status || ''}
                />
              </CardHeader>
              <CardContent className="pt-0 pb-0 px-2">
                <CommsLogsTable table={table} />
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

// function renderMessage(message: any) {
//   if (typeof message === 'string') {
//     return message;
//   }
//   return (
//     <div className="bg-card space-x-8 flex items-center">
//       <a
//         className="cursor-pointer inline-flex"
//         href={message?.mediaURL}
//         target="_blank"
//       >
//         <Download size={20} strokeWidth={1.5} className="mr-2" />
//         <span>{`${message?.fileName?.substring(0, 20)}...`}</span>
//       </a>
//       <div className="p-2 w-1/2">
//         <Player
//           src={message?.mediaURL}
//           accent={[41, 121, 214]}
//           grey={[250, 250, 250]}
//         />
//       </div>
//     </div>
//   );
// }

// function renderBadgeBg(status: string) {
//   if(status === SessionStatus.FAILED){
//     return "bg-red-200"
//   }
//   if(status === SessionStatus.COMPLETED){
//     return "bg-green-200"
//   }
//   if(status === SessionStatus.PENDING){
//     return
//   }
//   return "bg-gray-200"
// }
