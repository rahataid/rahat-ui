import {
  useGetCommunicationLogs,
  useListAllTransports,
  useListSessionLogs,
  usePagination,
  useSessionBroadCastCount,
  useSessionRetryFailed,
  useSingleActivity,
  useSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
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
  NoResult,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import CardSkeleton from 'apps/rahat-ui/src/common/cardSkeleton';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { UUID } from 'crypto';
import {
  CloudDownload,
  Mail,
  RefreshCcw,
  Mic,
  MessageSquare,
  Clock,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';

import { useParams, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';

import { downloadLogsCsv, exportFailedLogs } from './comms.logs.export.utils';
import CommsLogsTable from '../table/comms.logs.table';
import useCommsLogsTableColumns from '../table/useCommsLogsTableColumns';
import { getPhaseColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

export default function CommsLogsDetailPage() {
  const tGlobal = useTranslations('GLOBAL');
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const { id: projectID, commsIdXactivityIdXsessionId } = useParams();

  const [communicationId, activityId, sessionId] = (
    commsIdXactivityIdXsessionId as string
  ).split('%40');

  const commsSettings = useSettingsStore((state) => state.commsSettings);

  const downloadUrl = useMemo(
    () =>
      commsSettings?.URL
        ? `${
            commsSettings.URL
          }/broadcasts/download?sessionId=${encodeURIComponent(sessionId)}`
        : null,
    [commsSettings, sessionId],
  );

  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const backFrom = searchParams.get('backFrom');
  const tab = searchParams.get('tab');

  const subTab = searchParams.get('subTab');

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
  const { data: logs, isLoading } = useGetCommunicationLogs(
    projectID as UUID,
    communicationId,
    activityId,
  );

  const appTransports = useListAllTransports();

  const resolvedTransportName = useMemo(() => {
    const fromSession = logs?.sessionDetails?.Transport?.name;
    if (fromSession) return fromSession;

    const transportId = logs?.communicationDetail?.transportId;
    const fromTransport = appTransports?.find(
      (transport: any) => transport?.cuid === transportId,
    )?.name;
    if (fromTransport) return fromTransport;

    if (
      logs?.communicationDetail?.message &&
      typeof logs?.communicationDetail?.message !== 'string'
    ) {
      return 'VOICE';
    }

    return 'SMS';
  }, [logs, appTransports]);

  const columns = useCommsLogsTableColumns(resolvedTransportName);
  const cleanFilters = Object.fromEntries(
    Object.entries(debounceSearch).filter(
      ([_, v]) => v !== '' && v !== null && v !== undefined,
    ),
  );
  const { data: activityDetail, isLoading: isLoadingActivity } =
    useSingleActivity(projectID as UUID, activityId);

  const communicationTitle = logs?.communicationDetail?.communicationTitle;
  const {
    data: sessionLogs,
    isLoading: isLoadingSessionLogs,
    isError: isSessionLogsError,
  } = useListSessionLogs(sessionId, { ...pagination, ...cleanFilters });

  const logsMeta = sessionLogs?.httpReponse?.data?.meta;
  const latestBroadcastUpdatedAt = sessionLogs?.httpReponse?.data?.data?.reduce(
    (latest: string | null, row: any) =>
      !latest || new Date(row?.updatedAt) > new Date(latest)
        ? row?.updatedAt
        : latest,
    null,
  );

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
    const groupName = logs?.group?.name || logs?.groupName || '';

    if (!groupName) return tg('N_A');

    if (groupName.length > 20) {
      return `${groupName.slice(0, 20)}...`;
    }

    return groupName;
  }, [logs, tg]);

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
    exportFailedLogs(sessionLogs?.httpReponse?.data?.data ?? []);
  };

  const onExportAll = async () => {
    try {
      if (!downloadUrl) {
        return toast.error(
          t('FAILED_LOAD_COMMUNICATION_DATA'),
        );
      }
      if (!count?.data?.data) {
        return toast.error(
          t('COMMUNICATION_STATS_NOT_AVAILABLE'),
        );
      }
      const fileName = `${logs?.group?.name || 'group'}_${
        activityDetail?.title || 'activity'
      }_${new Date().toISOString().slice(0, 10)}.csv`;
      await downloadLogsCsv(downloadUrl, fileName);
      toast.success(t('LOGS_EXPORTED_SUCCESSFULLY'));
    } catch (error) {
      console.error('Error exporting all logs:', error);
      toast.error(
        t('FAILED_EXPORT_LOGS'),
      );
    }
  };

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = (event?.target?.value ?? '').trim();
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  const path = useMemo(() => {
    if (tab && subTab) {
      return `/projects/aa/${projectID}/communication-logs?tab=${tab}&subTab=${subTab}`;
    }

    return from === 'activities'
      ? `/projects/aa/${projectID}/activities/${activityId}${
          backFrom ? `?from=${backFrom}` : ''
        }`
      : `/projects/aa/${projectID}/communication-logs/details/${activityId}`;
  }, [from, projectID, activityId, tab, subTab, backFrom]);

  const hasNoLogsForExport =
    !isLoading &&
    !isLoadingActivity &&
    !isLoadingSessionLogs &&
    !isSessionLogsError &&
    (logsMeta?.total ?? 0) === 0;

  const hasNoFailedDeliveries = (count?.data?.data?.FAIL ?? 0) === 0;

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={path} />

        <div className="mt-1 flex flex-col pb-1 gap-2">
          <div className="flex justify-between">
            <Heading
              title={t('COMMUNICATION_DETAILS')}
              description={t('DETAILED_VIEW_OF_COMMUNICATION')}
            />
          </div>
          <div className="flex justify-between items-center">
            {latestBroadcastUpdatedAt ? (
              <p className="text-sm text-muted-foreground">
                {t('UPDATED_AT')}: {formatDate(latestBroadcastUpdatedAt)}
              </p>
            ) : (
              <div />
            )}
            <div className="flex gap-2 flex-col md:flex-row">
              <TooltipWrapper
                tip={t('NO_LOGS_TO_EXPORT')}
                disable={!hasNoLogsForExport}
              >
                <Button
                  variant="outline"
                  className=" gap-2 h-7"
                  onClick={onExportAll}
                  disabled={
                    isLoading ||
                    isLoadingActivity ||
                    isLoadingSessionLogs ||
                    hasNoLogsForExport
                  }
                >
                  <CloudDownload className="h-3.5 w-3.5" />
                  {isLoading || isLoadingActivity || isLoadingSessionLogs
                    ? t('LOADING')
                    : t('EXPORT_ALL_LOGS')}
                </Button>
              </TooltipWrapper>
              <TooltipWrapper
                tip={t('NO_FAILED_DELIVERIES_TO_EXPORT')}
                disable={!hasNoFailedDeliveries}
              >
                <Button
                  variant="outline"
                  className=" gap-2 h-7"
                  onClick={onFailedExports}
                  disabled={hasNoFailedDeliveries}
                >
                  <CloudDownload className="h-3.5 w-3.5" />
                  {t('FAILED_EXPORTS_ATTEMPTS')}
                </Button>
              </TooltipWrapper>
              {count?.data?.data &&
                count?.data?.data?.FAIL > 0 &&
                resolvedTransportName === 'VOICE' && (
                  <RoleAuth
                    roles={[
                      AARoles.ADMIN,
                      AARoles.MANAGER,
                      AARoles.Municipality,
                    ]}
                    hasContent={false}
                  >
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
                      {t('RETRY_FAILED_REQUESTS')}
                    </Button>
                  </RoleAuth>
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
                    <TooltipWrapper
                      tip={`${t('ACTIVITY_PHASE')}: ${activityDetail?.phase?.name}`}
                    >
                      <Badge
                        className={`${getPhaseColor(
                          activityDetail?.phase?.name,
                        )}`}
                      >
                        {activityDetail?.phase?.name}
                      </Badge>
                    </TooltipWrapper>
                    <TooltipWrapper
                      tip={`${t('ACTIVITY_STATUS')}: ${activityDetail?.status ? tGlobal(activityDetail.status) : ''}`}
                    >
                      <Badge
                        className={`rounded-xl capitalize text-xs font-normal ${getStatusBg(
                          activityDetail?.status,
                        )}`}
                      >
                        {activityDetail?.status ? tGlobal(activityDetail.status) : ''}
                      </Badge>
                    </TooltipWrapper>
                  </CardTitle>
                  <CardContent className="pl-1 pb-1  font-semibold flex flex-col gap-1">
                    <Label className="text-muted-foreground text-xs">
                      {t('ACTIVITY_TITLE')}:
                    </Label>
                    <TooltipWrapper
                      tip={`${t('ACTIVITY_TITLE')}: ${activityDetail?.title}`}
                    >
                      <Label className="text-base space-y-1 font-semibold">
                        {activityDetail?.title}
                      </Label>
                    </TooltipWrapper>
                  </CardContent>
                  <TooltipWrapper
                    tip={`${t('ACTIVITY_DESCRIPTION')}: ${activityDetail?.description}`}
                  >
                    <CardFooter className="pl-1 pb-2 text-sm text-muted-foreground">
                      {activityDetail?.description}
                    </CardFooter>
                  </TooltipWrapper>
                </Card>
              </div>

              {/* Right Section (Data Cards) — 2/3 on large screens */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <DataCard
                  title={t('SUCCESSFULLY_DELIVERED')}
                  smallNumber={formatNum(count?.data?.data?.SUCCESS ?? 0)}
                  className="rounded-sm w-full h-20 pt-10 pb-8"
                />
                <DataCard
                  title={t('FAILED_DELIVERED')}
                  smallNumber={formatNum(count?.data?.data?.FAIL ?? 0)}
                  className="rounded-sm w-full h-20 pt-10 pb-8"
                />
                <DataCard
                  title={tg('SCHEDULED')}
                  smallNumber={formatNum(count?.data?.data?.SCHEDULED ?? 0)}
                  className="rounded-sm w-full h-20 pt-10 pb-8"
                />
                <DataCard
                  title={tg('PENDING')}
                  smallNumber={formatNum(count?.data?.data?.PENDING ?? 0)}
                  className="rounded-sm w-full h-20 pt-10 pb-8"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
            <Card className="w-full col-span-1 bg-white rounded-sm">
              <CardContent className="p-0">
                <div className="gap-2 p-2 mb-2">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="border bg-secondary rounded h-[clamp(28px,3vw,36px)] mb-2">
                      <TabsTrigger
                        id="details"
                        className="data-[state=active]:bg-white text-[clamp(11px,1vw,14px)] h-[clamp(23px,3vw,28px)] "
                        value="details"
                      >
                        {tg('DETAILS')}
                      </TabsTrigger>
                      <TabsTrigger
                        id="logs"
                        className="data-[state=active]:bg-white text-[clamp(11px,1vw,14px)] h-[clamp(23px,3vw,28px)] ]"
                        value="logs"
                      >
                        {t('LOGS_TAB')}
                      </TabsTrigger>
                    </TabsList>
                    <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                      <TabsContent
                        value="details"
                        className="p-4 space-y-6 m-0"
                      >
                        {/* Beneficiary Group */}
                        <div>
                          <p className="text-sm text-gray-500">
                            {logs?.communicationDetail?.groupType
                              ? translateValue(tg, logs.communicationDetail.groupType, {
                                  fallbackStyle: 'raw',
                                }) +
                                ' ' +
                                t('GROUP')
                              : tg('N_A')}
                          </p>
                          <p className="font-medium">{logsGroupName}</p>
                        </div>

                        {/* Triggered Date */}
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('TRIGGERED_DATE')}
                          </p>
                          <p className="font-medium">
                            {formatDate(logs?.sessionDetails?.updatedAt)}
                          </p>
                        </div>

                        {/* Total Audience */}
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('TOTAL_AUDIENCE')}
                          </p>
                          <p className="font-medium">{formatNum(logsMeta?.total ?? 0)}</p>
                        </div>

                        {logs?.sessionDetails?.startedAt && (
                          <div>
                            <p className="text-sm text-gray-500">{t('STARTED_AT')}</p>
                            <p className="font-medium">
                              {formatDate(logs?.sessionDetails?.startedAt)}
                            </p>
                          </div>
                        )}

                        {logs?.sessionDetails?.endedAt && (
                          <div>
                            <p className="text-sm text-gray-500">{t('ENDED_AT')}</p>
                            <p className="font-medium">
                              {formatDate(logs?.sessionDetails?.endedAt)}
                            </p>
                          </div>
                        )}

                        {/* VOICE Status */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                              {resolvedTransportName === 'VOICE' ? (
                                <Mic />
                              ) : resolvedTransportName === 'EMAIL' ? (
                                <Mail />
                              ) : (
                                <MessageSquare />
                              )}
                            </div>
                            <span className="font-medium">
                              {resolvedTransportName}
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
                            {translateValue(tg, logs?.sessionDetails?.status)}
                          </Badge>
                        </div>

                        {/* Communication */}
                        <div className="space-y-3">
                          <TooltipWrapper
                            tip={`${t('COMMUNICATION_TITLE')}: ${communicationTitle}`}
                          >
                            <p className="text-sm text-gray-500">
                              {communicationTitle}
                            </p>
                          </TooltipWrapper>
                          {logs?.communicationDetail?.subject && (
                            <TooltipWrapper
                              tip={`${t('COMMUNICATION_SUBJECT')}: ${logs?.communicationDetail?.subject}`}
                            >
                              <div>
                                <p className="font-medium">
                                  {logs.communicationDetail.subject}
                                </p>
                              </div>
                            </TooltipWrapper>
                          )}
                          <TooltipWrapper
                            tip={`${t('COMMUNICATION_MESSAGE')}: ${getCommunicationMessage(
                              logs?.communicationDetail?.message,
                              tg('N_A'),
                            )}`}
                          >
                            <div>
                              {renderMessage(
                                logs?.communicationDetail?.message,
                              )}
                            </div>
                          </TooltipWrapper>
                        </div>
                      </TabsContent>
                      <TabsContent value="logs" className="p-2 m-0 space-y-3">
                        {logs?.sessionDetails?.stats?.runs?.length ? (
                          logs.sessionDetails.stats.runs.map(
                            (run: any, index: number) => (
                              <Card
                                key={index}
                                className="rounded-sm shadow-sm"
                              >
                                <CardContent className="p-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">
                                        {t('RUN_NUMBER', { number: index + 1 })}
                                      </span>
                                    </div>
                                    <Badge
                                      className={`text-[10px] ${
                                        run.trigger === 'initial'
                                          ? 'bg-blue-100 text-blue-600'
                                          : 'bg-orange-100 text-orange-600'
                                      }`}
                                    >
                                      {run.trigger}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <p>{t('STARTED')}: {formatDate(run.startedAt)}</p>
                                    <p>{t('ENDED')}: {formatDate(run.endedAt)}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            ),
                          )
                        ) : (
                          <NoResult message={t('NO_LOGS_AVAILABLE')} />
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 w-full rounded-sm">
              <CardHeader className="flex flex-row items-center justify-center gap-2 pb-0 pt-0.5 space-y-0 px-2">
                <SearchInput
                  className="w-full"
                  value={filters.address}
                  name={tGlobal('AUDIENCE')}
                  onSearch={(e) => handleSearch(e, 'address')}
                />
                <SelectComponent
                  name={t('STATUS')}
                  options={['ALL', 'SUCCESS', 'PENDING', 'FAIL']}
                  labels={{
                    ALL: tGlobal('ALL'),
                    SUCCESS: tGlobal('SUCCESS'),
                    PENDING: tGlobal('PENDING'),
                    FAIL: tGlobal('FAIL'),
                  }}
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

function getCommunicationMessage(message: any, naLabel: string): string {
  if (typeof message === 'string') {
    return message;
  }
  return message?.fileName || naLabel;
}

function renderMessage(message: any) {
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
