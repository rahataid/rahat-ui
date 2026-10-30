'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Heading,
  Back,
  SearchInput,
  CustomPagination,
  NoResult,
} from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import { CommunicationTooltip } from '../components/communication-tooltip';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import {
  CloudDownload,
  RefreshCcw,
  SendHorizontal,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  Hourglass,
} from 'lucide-react';
import {
  useListSessionLogs,
  useSessionBroadCastCount,
  useSessionRetryFailed,
  useGetCommunication,
  useListAllTransports,
  useBeneficiariesGroups,
  useStakeholdersGroups,
  useSingleBeneficiaryGroup,
  useSingleStakeholdersGroup,
  useTriggerCommunicationBroadcast,
  usePagination,
} from '@rahat-ui/query';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import {
  resolveChannelByTransportId,
  resolveCommunicationLifecycleStatus,
} from '../utils/communications.utils';
import { CommunicationChannelIcon } from '../components/communication-channel-icon';
import { SendCommunicationConfirmDialog } from '../components/send-communication-confirm-dialog';
import { CommunicationStatusBadge } from '../components/communication-status-badge';
import CommsLogsTable from '../../communicationLog/table/comms.logs.table';
import useCommsLogsTableColumns from '../../communicationLog/table/useCommsLogsTableColumns';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { UUID } from 'crypto';

export function CommunicationSessionLogsView() {
  const tGlobal = useTranslations('GLOBAL');
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();

  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const commId = params.commId as string;
  const sessionOrTargetId = params.sessionId as string;

  const backPath = `/projects/aa/${projectId}/communications/${commId}`;

  const {
    data: communication,
    isLoading: isLoadingComm,
    isError: isCommError,
    refetch: refetchComm,
  } = useGetCommunication(projectId as UUID, commId);
  const rawComm = (communication as any)?.data ?? communication;

  const appTransports = useListAllTransports();
  const channel = resolveChannelByTransportId(
    appTransports,
    rawComm?.transportId,
    rawComm?.audioURL,
  );

  const { data: beneficiaryGroupsData } = useBeneficiariesGroups(
    projectId as UUID,
    { page: 1, perPage: 100 },
  );
  const { data: stakeholderGroupsData } = useStakeholdersGroups(
    projectId as UUID,
    { page: 1, perPage: 100 },
  );

  const getGroupDetails = (
    groupId: string,
    groupType: string,
    targetGroupObj?: any,
  ) => {
    if (targetGroupObj?.name) {
      const count =
        targetGroupObj?._count?.beneficiaries ??
        targetGroupObj?._count?.stakeholders ??
        targetGroupObj?.beneficiaries?.length ??
        targetGroupObj?.stakeholders?.length ??
        0;
      return { name: targetGroupObj.name, count };
    }

    const isBeneficiary = groupType === 'BENEFICIARY';
    const groupsData: any = isBeneficiary
      ? beneficiaryGroupsData
      : stakeholderGroupsData;
    const list = Array.isArray(groupsData?.data) ? groupsData.data : groupsData;
    const rawList = Array.isArray(list) ? list : [];

    const found = (rawList as any[]).find(
      (g: any) => g?.uuid === groupId || g?.id === groupId,
    );
    if (found) {
      const count = isBeneficiary
        ? found._count?.beneficiaries ??
          found?.groupedBeneficiaries?.length ??
          found?.beneficiaries?.length ??
          0
        : found._count?.stakeholders ?? found?.stakeholders?.length ?? 0;
      return { name: found.name, count };
    }

    return {
      name:
        groupId ||
        (isBeneficiary ? t('BENEFICIARY_GROUP') : t('STAKEHOLDER_GROUP')),
      count: 0,
    };
  };

  const targetGroup = useMemo(() => {
    if (!Array.isArray(rawComm?.targets)) return null;
    return (
      rawComm.targets.find(
        (t: any) =>
          t.sessionId === sessionOrTargetId ||
          t.uuid === sessionOrTargetId ||
          t.groupId === sessionOrTargetId,
      ) ??
      (rawComm.targets.length === 1 ? rawComm.targets[0] : null)
    );
  }, [rawComm, sessionOrTargetId]);

  const groupInfo = useMemo(() => {
    if (!targetGroup) {
      return { name: tg('N_A'), count: 0 };
    }
    return getGroupDetails(
      targetGroup.groupId,
      targetGroup.groupType,
      targetGroup.group,
    );
  }, [targetGroup, beneficiaryGroupsData, stakeholderGroupsData, tg, t]);

  const actualSessionId = useMemo(() => {
    if (
      targetGroup?.sessionId &&
      targetGroup.sessionId !== 'undefined' &&
      targetGroup.sessionId !== 'null'
    ) {
      return targetGroup.sessionId;
    }
    if (
      sessionOrTargetId &&
      sessionOrTargetId !== 'undefined' &&
      sessionOrTargetId !== 'null' &&
      sessionOrTargetId !== targetGroup?.uuid &&
      sessionOrTargetId !== targetGroup?.groupId
    ) {
      return sessionOrTargetId;
    }
    return '';
  }, [targetGroup, sessionOrTargetId]);

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const debounceSearch = useDebounce(filters, 500);
  const cleanFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(debounceSearch).filter(
          ([_, v]) => v !== '' && v !== null && v !== undefined,
        ),
      ),
    [debounceSearch],
  );

  const {
    data: sessionLogsData,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useListSessionLogs(actualSessionId, {
    ...pagination,
    address: cleanFilters.address || undefined,
    status: cleanFilters.status === 'ALL' ? undefined : cleanFilters.status,
  });

  const isBeneficiaryGroup = targetGroup?.groupType === 'BENEFICIARY';
  const isStakeholderGroup = targetGroup?.groupType === 'STAKEHOLDER';
  const targetGroupId = targetGroup?.groupId;

  const {
    data: singleBeneficiaryGroupData,
  } = useSingleBeneficiaryGroup(
    projectId as UUID,
    (isBeneficiaryGroup && targetGroupId ? targetGroupId : '') as UUID,
  );

  const {
    data: singleStakeholderGroupData,
  } = useSingleStakeholdersGroup(
    projectId as UUID,
    (isStakeholderGroup && targetGroupId ? targetGroupId : '') as UUID,
  );

  const groupFromList = useMemo(() => {
    const groupsData: any = isBeneficiaryGroup
      ? beneficiaryGroupsData
      : stakeholderGroupsData;
    const list = Array.isArray(groupsData?.data) ? groupsData.data : groupsData;
    const rawList = Array.isArray(list) ? list : [];
    return rawList.find(
      (g: any) => g?.uuid === targetGroupId || g?.id === targetGroupId,
    );
  }, [
    isBeneficiaryGroup,
    beneficiaryGroupsData,
    stakeholderGroupsData,
    targetGroupId,
  ]);

  const audienceList = useMemo(() => {
    if (isBeneficiaryGroup) {
      const list =
        singleBeneficiaryGroupData?.groupedBeneficiaries ||
        targetGroup?.group?.groupedBeneficiaries ||
        targetGroup?.group?.beneficiaries ||
        groupFromList?.groupedBeneficiaries ||
        groupFromList?.beneficiaries ||
        [];
      return list.map((item: any) => {
        const b = item?.Beneficiary || item;
        return {
          address:
            b?.pii?.phone ||
            b?.phone ||
            b?.walletAddress ||
            b?.pii?.email ||
            b?.email ||
            '',
          name: b?.pii?.name || b?.name || '',
          phone: b?.pii?.phone || b?.phone || '',
          wallet: b?.walletAddress || '',
          email: b?.pii?.email || b?.email || '',
        };
      });
    }

    if (isStakeholderGroup) {
      const list =
        singleStakeholderGroupData?.stakeholders ||
        targetGroup?.group?.stakeholders ||
        groupFromList?.stakeholders ||
        [];
      return list.map((item: any) => ({
        address: item?.phone || item?.email || item?.walletAddress || '',
        name: item?.name || '',
        phone: item?.phone || '',
        wallet: item?.walletAddress || '',
        email: item?.email || '',
      }));
    }

    return [];
  }, [
    isBeneficiaryGroup,
    isStakeholderGroup,
    singleBeneficiaryGroupData,
    singleStakeholderGroupData,
    targetGroup,
    groupFromList,
  ]);

  const { data: broadcastCounts, isLoading: isBroadcastLoading } =
    useSessionBroadCastCount(actualSessionId ? [actualSessionId] : []);

  const isBroadcastResolving =
    !!actualSessionId && (isBroadcastLoading || broadcastCounts === undefined);

  const counts = useMemo(() => {
    const rawCounts =
      (broadcastCounts as any)?.data?.data ??
      (broadcastCounts as any)?.data ??
      broadcastCounts;
    if (actualSessionId && rawCounts) {
      return {
        SUCCESS: rawCounts.SUCCESS ?? 0,
        FAIL: rawCounts.FAIL ?? 0,
        PENDING: rawCounts.PENDING ?? 0,
        SCHEDULED: rawCounts.SCHEDULED ?? 0,
        TOTAL: rawCounts.TOTAL ?? 0,
      };
    }
    return {
      SUCCESS: 0,
      FAIL: 0,
      PENDING: 0,
      SCHEDULED: 0,
      TOTAL: 0,
    };
  }, [actualSessionId, broadcastCounts]);

  const mutateRetry = useSessionRetryFailed();
  const triggerBroadcast = useTriggerCommunicationBroadcast();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);

  const effectiveStatus = useMemo(() => {
    return resolveCommunicationLifecycleStatus({
      channel,
      rawStatus: targetGroup?.status,
      counts: actualSessionId ? counts : undefined,
      hasActiveTargets: targetGroup?.status === 'PROCESSING',
      hasPendingTargets:
        targetGroup?.status === 'PENDING' || !targetGroup?.status || !actualSessionId,
      hasSession: !!actualSessionId,
      isRetrying:
        mutateRetry.isPending || triggerBroadcast.isPending || isRetrying,
    });
  }, [
    channel,
    targetGroup?.status,
    counts,
    actualSessionId,
    mutateRetry.isPending,
    triggerBroadcast.isPending,
    isRetrying,
  ]);

  const logsList = useMemo(() => {
    if (!actualSessionId) return [];
    const raw =
      (sessionLogsData as any)?.data ??
      (sessionLogsData as any)?.httpReponse?.data?.data ??
      [];
    return Array.isArray(raw) ? raw : [];
  }, [actualSessionId, sessionLogsData]);

  const logsMeta = useMemo(() => {
    if (!actualSessionId) {
      return {
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        next: null,
        prev: null,
      };
    }
    return (
      (sessionLogsData as any)?.meta ??
      (sessionLogsData as any)?.httpReponse?.data?.meta ?? {
        total: logsList.length,
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        next: null,
        prev: null,
      }
    );
  }, [actualSessionId, sessionLogsData, logsList.length]);

  const columns = useCommsLogsTableColumns(channel);

  const table = useReactTable({
    manualPagination: true,
    data: logsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const audienceTotalCount = useMemo(() => {
    return (
      groupInfo.count ||
      audienceList.length ||
      logsMeta?.total ||
      0
    );
  }, [groupInfo.count, audienceList.length, logsMeta?.total]);

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
      const value = (event?.target?.value ?? '').trim();
      setFilters({ ...filters, [key]: value });
      setPagination({
        ...pagination,
        page: 1,
      });
    },
    [filters, pagination, setFilters, setPagination],
  );

  const canSend =
    !actualSessionId &&
    (targetGroup?.status === 'PENDING' || !targetGroup?.status);
  const canRetry = counts.FAIL > 0 || targetGroup?.status === 'FAILED';

  const handleSend = async () => {
    if (triggerBroadcast.isPending || isRetrying) return;
    setIsRetrying(true);
    try {
      await triggerBroadcast.mutateAsync({
        projectUUID: projectId as UUID,
        communicationUUID: commId,
      });
      await refetchComm();
    } catch (error) {
      console.error('Send communication error:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRetry = async () => {
    if (mutateRetry.isPending || isRetrying) return;
    setIsRetrying(true);
    try {
      if (actualSessionId) {
        await mutateRetry.mutateAsync({
          cuid: actualSessionId,
          includeFailed: true,
        });
        refetchLogs();
      } else {
        await triggerBroadcast.mutateAsync({
          projectUUID: projectId as UUID,
          communicationUUID: commId,
        });
        await refetchComm();
      }
    } catch (error) {
      console.error('Retry error:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoadingComm) {
    return (
      <div className="h-[calc(100vh-65px)] p-4">
        <Back path={backPath} />
        <div className="h-full flex flex-col justify-center items-center space-y-3">
          <p className="text-gray-500 text-sm">{t('LOADING')}</p>
        </div>
      </div>
    );
  }

  if (isCommError || !rawComm?.uuid) {
    return (
      <div className="h-[calc(100vh-65px)] p-4">
        <Back path={backPath} />
        <div className="h-full flex flex-col justify-center items-center space-y-3">
          <p className="text-gray-500 text-sm">{t('COMMUNICATION_NOT_FOUND')}</p>
          <button
            onClick={() => router.push(backPath)}
            className="text-primary hover:underline text-sm flex items-center font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('GO_BACK')}
          </button>
        </div>
      </div>
    );
  }

  const audioURL = typeof rawComm?.audioURL === 'object' ? rawComm.audioURL : null;
  const messageText =
    typeof rawComm?.message === 'string' && rawComm.message.trim()
      ? rawComm.message
      : rawComm?.subject || null;

  return (
    <div className="p-3 sm:p-4 space-y-3">
      {/* ── Header Section ── */}
      <div className="flex flex-col space-y-0">
        <Back path={backPath} />

        <div className="mt-1 flex flex-col pb-0.5 gap-2">
          <div className="flex justify-between items-start">
            <Heading
              title={t('COMMUNICATION_DETAILS')}
              description={t('DETAILED_VIEW_OF_COMMUNICATION')}
            />
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-xs text-muted-foreground">
              {t('UPDATED_AT')}:{' '}
              {formatDate(
                targetGroup?.updatedAt || rawComm?.updatedAt,
                'MMMM d, yyyy, h:mm:ss a',
              )}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 h-8 text-xs font-medium"
              >
                <CloudDownload className="h-3.5 w-3.5" />
                {t('EXPORT_ALL_LOGS')}
              </Button>

              <Button
                variant="outline"
                className="gap-2 h-8 text-xs font-medium"
              >
                <CloudDownload className="h-3.5 w-3.5" />
                {t('FAILED_EXPORTS_ATTEMPTS')}
              </Button>

              {canRetry && (
                <DialogComponent
                  buttonIcon={RefreshCcw}
                  buttonText={t('RETRY_FAILED_REQUESTS') || 'Retry Failed'}
                  dialogTitle={t('RETRY_COMMUNICATION') || 'Retry Communication'}
                  dialogDescription={
                    t('RETRY_COMMUNICATION_CONFIRM') ||
                    'Are you sure you want to retry this communication?'
                  }
                  confirmButtonText={t('CONFIRM') || 'Confirm'}
                  handleClick={handleRetry}
                  buttonClassName="gap-1.5 h-8 px-3.5 text-xs bg-primary text-white hover:!bg-primary/90 shrink-0 whitespace-nowrap"
                  confirmButtonClassName="rounded-sm bg-primary"
                  variant="default"
                />
              )}

              {canSend && (
                <Button
                  className="gap-1.5 h-8 px-3.5 text-xs bg-primary text-white hover:!bg-primary/90 shrink-0 whitespace-nowrap"
                  onClick={() => setIsSendConfirmOpen(true)}
                  disabled={triggerBroadcast.isPending || isRetrying}
                >
                  <SendHorizontal className="h-3.5 w-3.5" />
                  {t('SEND_COMMUNICATION') || 'Send Communication'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Upper Overview Banner & Data Cards Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 w-full mt-1">
          {/* Left Overview Card (7 cols) */}
          <div className="lg:col-span-7 min-w-0 flex flex-col">
            <Card className="p-3 sm:p-3.5 rounded-sm bg-white border border-gray-200/90 shadow-none h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 pb-0.5 flex-wrap">
                  <span className="bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded border border-slate-200/80 flex items-center gap-1.5">
                    <CommunicationChannelIcon
                      channel={channel}
                      className="h-3.5 w-3.5 text-slate-600"
                    />
                    {t(channel)}
                  </span>
                  <CommunicationStatusBadge
                    status={effectiveStatus}
                    isLoading={isBroadcastResolving}
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {t('COMMUNICATION_TITLE')}:
                  </span>
                  <CommunicationTooltip
                    content={`${t('COMMUNICATION_TITLE')}: ${
                      rawComm?.title || ''
                    }`}
                  >
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-snug break-all cursor-default">
                      {rawComm?.title || t('COMMUNICATION')}
                    </h2>
                  </CommunicationTooltip>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                    {t(channel)}
                    {targetGroup?.groupType
                      ? ` • ${
                          targetGroup.groupType === 'BENEFICIARY'
                            ? t('BENEFICIARY')
                            : t('STAKEHOLDER')
                        }`
                      : ''}
                    {groupInfo.name ? ` • ${groupInfo.name}` : ''}
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                <p className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {channel === 'VOICE'
                    ? t('VOICE_RECORDING')
                    : t('MESSAGE_CONTENT')}
                </p>
                {channel === 'VOICE' && audioURL?.mediaURL ? (
                  <div className="bg-slate-50/80 p-1.5 sm:p-2 rounded border border-gray-200/80 space-y-1">
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-600 truncate">
                      {audioURL.fileName || 'recording.wav'}
                    </p>
                    <audio
                      src={audioURL.mediaURL}
                      controls
                      className="w-full h-7 rounded"
                    />
                  </div>
                ) : messageText ? (
                  <div className="bg-slate-50/80 p-2 rounded border border-gray-200/80 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-20 overflow-y-auto font-sans">
                    {messageText}
                  </div>
                ) : (
                  <div className="bg-slate-50/80 p-2 rounded border border-gray-200/80 text-xs text-muted-foreground italic">
                    {tg('N_A')}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] text-muted-foreground pt-1.5 border-t border-gray-100">
                  {actualSessionId && (targetGroup?.createdAt || rawComm?.createdAt) && (
                    <span>
                      {t('STARTED_AT')}:{' '}
                      {formatDate(
                        targetGroup?.createdAt || rawComm?.createdAt,
                        'MMMM d, yyyy, h:mm:ss a',
                      )}
                    </span>
                  )}
                  {(effectiveStatus === 'COMPLETED' || effectiveStatus === 'FAILED') && (
                    <span>
                      {t('ENDED_AT')}:{' '}
                      {formatDate(
                        targetGroup?.updatedAt || rawComm?.updatedAt,
                        'MMMM d, yyyy, h:mm:ss a',
                      )}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right 4 Summary Data Cards (5 cols) */}
          <div className="lg:col-span-5 min-w-0 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-2.5 h-full">
            <div className="bg-white rounded-sm border border-gray-200/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-1">
                <span className="font-medium text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-2" title={t('SUCCESSFULLY_DELIVERED')}>
                  {t('SUCCESSFULLY_DELIVERED')}
                </span>
                <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-1 sm:mt-1.5">
                {isLoadingComm || isLoadingLogs ? (
                  <Skeleton className="h-5 w-10" />
                ) : (
                  <span className="text-primary font-bold text-lg sm:text-xl tracking-tight leading-none">
                    {formatNum(counts.SUCCESS)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-1">
                <span className="font-medium text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-2" title={t('FAILED_DELIVERED')}>
                  {t('FAILED_DELIVERED')}
                </span>
                <div className="h-5 w-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-1 sm:mt-1.5">
                {isLoadingComm || isLoadingLogs ? (
                  <Skeleton className="h-5 w-10" />
                ) : (
                  <span className="text-primary font-bold text-lg sm:text-xl tracking-tight leading-none">
                    {formatNum(counts.FAIL)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-1">
                <span className="font-medium text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-2" title={tg('SCHEDULED')}>
                  {tg('SCHEDULED')}
                </span>
                <div className="h-5 w-5 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <CalendarClock className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-1 sm:mt-1.5">
                {isLoadingComm || isLoadingLogs ? (
                  <Skeleton className="h-5 w-10" />
                ) : (
                  <span className="text-primary font-bold text-lg sm:text-xl tracking-tight leading-none">
                    {formatNum(counts.SCHEDULED)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-1">
                <span className="font-medium text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-2" title={tg('PENDING')}>
                  {tg('PENDING')}
                </span>
                <div className="h-5 w-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Hourglass className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-1 sm:mt-1.5">
                {isLoadingComm || isLoadingLogs ? (
                  <Skeleton className="h-5 w-10" />
                ) : (
                  <span className="text-primary font-bold text-lg sm:text-xl tracking-tight leading-none">
                    {formatNum(counts.PENDING)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Left Tabs (Details / Logs) + Right Table (Logs) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Left Column (Card with Tabs) */}
        <Card className="w-full col-span-1 bg-white rounded-sm">
          <CardContent className="p-0">
            <div className="gap-2 p-2 mb-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="border bg-secondary rounded h-[clamp(28px,3vw,36px)] mb-2">
                  <TabsTrigger
                    id="details"
                    className="data-[state=active]:bg-white text-[clamp(11px,1vw,14px)] h-[clamp(23px,3vw,28px)]"
                    value="details"
                  >
                    {tg('DETAILS')}
                  </TabsTrigger>
                  <TabsTrigger
                    id="logs"
                    className="data-[state=active]:bg-white text-[clamp(11px,1vw,14px)] h-[clamp(23px,3vw,28px)]"
                    value="logs"
                  >
                    {t('LOGS_TAB')}
                  </TabsTrigger>
                </TabsList>
                <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                  <TabsContent
                    value="details"
                    className="p-4 space-y-3 m-0"
                  >
                    {/* Beneficiary Group */}
                    <div>
                      <p className="text-sm text-gray-500">
                        {targetGroup?.groupType
                          ? translateValue(
                              tg,
                              targetGroup.groupType,
                              {
                                fallbackStyle: 'raw',
                              },
                            ) +
                            ' ' +
                            t('GROUP')
                          : tg('N_A')}
                      </p>
                      <p className="font-medium">{groupInfo.name}</p>
                    </div>

                    {/* Triggered Date */}
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('TRIGGERED_DATE')}
                      </p>
                      <p className="font-medium">
                        {actualSessionId && (targetGroup?.updatedAt || rawComm?.updatedAt)
                          ? formatDate(targetGroup?.updatedAt || rawComm?.updatedAt)
                          : tg('N_A')}
                      </p>
                    </div>

                    {/* Total Audience */}
                    <div>
                      <p className="text-sm text-gray-500">
                        {t('TOTAL_AUDIENCE')}
                      </p>
                      <p className="font-medium">
                        {formatNum(audienceTotalCount)}
                      </p>
                    </div>

                    {actualSessionId && (targetGroup?.createdAt || rawComm?.createdAt) && (
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('STARTED_AT')}
                        </p>
                        <p className="font-medium">
                          {formatDate(targetGroup?.createdAt || rawComm?.createdAt)}
                        </p>
                      </div>
                    )}

                    {(effectiveStatus === 'COMPLETED' || effectiveStatus === 'FAILED') && (
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('ENDED_AT')}
                        </p>
                        <p className="font-medium">
                          {formatDate(targetGroup?.updatedAt || rawComm?.updatedAt)}
                        </p>
                      </div>
                    )}

                    {/* Channel Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <CommunicationChannelIcon
                            channel={channel}
                            className="h-4 w-4 text-gray-600"
                          />
                        </div>
                        <span className="font-medium">
                          {t(channel)}
                        </span>
                      </div>

                      <CommunicationStatusBadge
                        status={effectiveStatus}
                        isLoading={isBroadcastResolving}
                      />
                    </div>

                    {/* Communication */}
                    <div className="space-y-3">
                      <TooltipWrapper
                        tip={`${t(
                          'COMMUNICATION_TITLE',
                        )}: ${rawComm?.title || ''}`}
                      >
                        <p className="text-sm text-gray-500">
                          {rawComm?.title || ''}
                        </p>
                      </TooltipWrapper>
                      {rawComm?.subject && (
                        <TooltipWrapper
                          tip={`${t('COMMUNICATION_SUBJECT')}: ${
                            rawComm.subject
                          }`}
                        >
                          <div>
                            <p className="font-medium">
                              {rawComm.subject}
                            </p>
                          </div>
                        </TooltipWrapper>
                      )}
                      <TooltipWrapper
                        tip={`${t(
                          'COMMUNICATION_MESSAGE',
                        )}: ${messageText || tg('N_A')}`}
                      >
                        <div>
                          {channel === 'VOICE' && audioURL?.mediaURL ? (
                            <div className="bg-gray-50 p-3 rounded-sm space-y-1">
                              <p className="text-center text-xs mb-2">{audioURL.fileName || 'recording.wav'}</p>
                              <audio src={audioURL.mediaURL} controls className="w-full h-10" />
                            </div>
                          ) : messageText ? (
                            <p className="font-medium text-xs whitespace-pre-wrap">{messageText}</p>
                          ) : (
                            <p className="text-gray-400 italic text-xs">{tg('N_A')}</p>
                          )}
                        </div>
                      </TooltipWrapper>
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="p-2 m-0 space-y-3">
                    {actualSessionId && targetGroup ? (
                      <Card className="rounded-sm shadow-sm">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {t('RUN_NUMBER', {
                                  number: formatNum(1),
                                })}
                              </span>
                            </div>
                            <CommunicationStatusBadge status={effectiveStatus} />
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>
                              {t('STARTED')}:{' '}
                              {formatDate(
                                targetGroup?.createdAt || rawComm?.createdAt,
                              )}
                            </p>
                            <p>
                              {t('ENDED')}:{' '}
                              {formatDate(
                                targetGroup?.updatedAt || rawComm?.updatedAt,
                              )}
                            </p>
                          </div>
                          {targetGroup?.error && (
                            <p className="text-xs text-red-500 pt-1 border-t border-gray-100">
                              {targetGroup.error}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <NoResult message={t('NO_LOGS_AVAILABLE')} />
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Right Column (Communication Logs Table Card) */}
        <Card className="col-span-1 md:col-span-2 w-full rounded-sm bg-white border border-gray-200/90 shadow-none">
          <CardHeader className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 pb-2 space-y-0">
            <div className="flex-1 min-w-0">
              <SearchInput
                className="w-full"
                value={filters?.address || ''}
                name={tGlobal('AUDIENCE')}
                onSearch={(e: any) => handleSearch(e, 'address')}
              />
            </div>
            <div className="w-full sm:w-44 shrink-0">
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
            </div>
          </CardHeader>

          <CardContent className="px-3 pt-0 pb-1">
            <CommsLogsTable
              table={table}
              isLoading={isLoadingLogs}
            />
          </CardContent>

          <CardFooter className="justify-end px-3 py-2 border-t border-gray-100">
            <CustomPagination
              meta={logsMeta}
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

      <SendCommunicationConfirmDialog
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onConfirm={async () => {
          await handleSend();
          setIsSendConfirmOpen(false);
        }}
        isPending={triggerBroadcast.isPending || isRetrying}
        title={rawComm?.title}
        channel={rawComm?.channel}
        recipientsCount={groupInfo?.count ?? targetGroup?.group?.count}
      />
    </div>
  );
}
