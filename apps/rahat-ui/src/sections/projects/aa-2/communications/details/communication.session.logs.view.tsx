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
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import {
  CloudDownload,
  RefreshCcw,
  SendHorizontal,
  Clock,
  ArrowLeft,
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
import { CommunicationStatusBadge } from '../components/communication-status-badge';
import CommsLogsTable from '../../communicationLog/table/comms.logs.table';
import useCommsLogsTableColumns from '../../communicationLog/table/useCommsLogsTableColumns';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';

function renderBadgeBg(status?: string) {
  const s = status?.toUpperCase();
  if (s === 'FAIL' || s === 'FAILED') {
    return 'bg-red-100 text-red-700 hover:bg-red-100';
  }
  if (s === 'SUCCESS' || s === 'COMPLETED' || s === 'SENT') {
    return 'bg-green-100 text-green-700 hover:bg-green-100';
  }
  if (s === 'PENDING' || s === 'PROCESSING') {
    return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
  }
  return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
}

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
    isLoading: isLoadingBeneficiaryGroup,
  } = useSingleBeneficiaryGroup(
    projectId as UUID,
    (isBeneficiaryGroup && targetGroupId ? targetGroupId : '') as UUID,
  );

  const {
    data: singleStakeholderGroupData,
    isLoading: isLoadingStakeholderGroup,
  } = useSingleStakeholdersGroup(
    projectId as UUID,
    (isStakeholderGroup && targetGroupId ? targetGroupId : '') as UUID,
  );

  const isLoadingAudience =
    (isBeneficiaryGroup && isLoadingBeneficiaryGroup) ||
    (isStakeholderGroup && isLoadingStakeholderGroup);

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
    if (actualSessionId && broadcastCounts?.data) {
      return {
        SUCCESS: broadcastCounts.data.SUCCESS ?? 0,
        FAIL: broadcastCounts.data.FAIL ?? 0,
        PENDING: broadcastCounts.data.PENDING ?? 0,
        SCHEDULED: broadcastCounts.data.SCHEDULED ?? 0,
        TOTAL: broadcastCounts.data.TOTAL ?? 0,
      };
    }
    const isPending =
      !targetGroup?.status ||
      targetGroup?.status === 'PENDING' ||
      targetGroup?.status === 'PROCESSING';
    const isFailed = targetGroup?.status === 'FAILED';
    const totalAudience = groupInfo.count || audienceList.length || 0;
    return {
      SUCCESS: 0,
      FAIL: isFailed ? totalAudience : 0,
      PENDING: isPending ? totalAudience : 0,
      SCHEDULED: 0,
      TOTAL: totalAudience,
    };
  }, [
    actualSessionId,
    broadcastCounts?.data,
    targetGroup?.status,
    groupInfo.count,
    audienceList.length,
  ]);

  const mutateRetry = useSessionRetryFailed();
  const triggerBroadcast = useTriggerCommunicationBroadcast();
  const [isRetrying, setIsRetrying] = useState(false);

  const effectiveStatus = useMemo(() => {
    return resolveCommunicationLifecycleStatus({
      channel,
      rawStatus: targetGroup?.status,
      counts,
      hasActiveTargets: targetGroup?.status === 'PROCESSING',
      hasPendingTargets:
        targetGroup?.status === 'PENDING' || !targetGroup?.status,
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

  const logsList = sessionLogsData?.httpReponse?.data?.data ?? [];
  const logsMeta = sessionLogsData?.httpReponse?.data?.meta ?? {
    total: 0,
    currentPage: 1,
    lastPage: 0,
    perPage: 10,
    next: null,
    prev: null,
  };

  const audienceAsLogRows = useMemo(() => {
    const rawStatus = targetGroup?.status || 'PENDING';
    const mappedStatus =
      rawStatus === 'SENT' || rawStatus === 'PROCESSING'
        ? 'PENDING'
        : rawStatus;

    return audienceList.map((item: any) => ({
      address: item.address,
      name: item.name,
      status: mappedStatus,
      attempts: 0,
      disposition: targetGroup?.error
        ? { disposition: targetGroup.error }
        : null,
      updatedAt: targetGroup?.updatedAt || rawComm?.updatedAt,
    }));
  }, [
    audienceList,
    targetGroup?.status,
    targetGroup?.error,
    targetGroup?.updatedAt,
    rawComm?.updatedAt,
  ]);

  const filteredAudienceLogRows = useMemo(() => {
    const search = (cleanFilters.address || '').trim().toLowerCase();
    const status = cleanFilters.status;

    return audienceAsLogRows.filter((row: any) => {
      const matchSearch =
        !search ||
        (row.address && String(row.address).toLowerCase().includes(search)) ||
        (row.name && String(row.name).toLowerCase().includes(search));

      const matchStatus =
        !status ||
        status === 'ALL' ||
        String(row.status).toUpperCase() === status.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [audienceAsLogRows, cleanFilters.address, cleanFilters.status]);

  const displayData = useMemo(() => {
    if (actualSessionId && logsList.length > 0) return logsList;
    if (!actualSessionId && filteredAudienceLogRows.length > 0) {
      const start = (pagination.page - 1) * pagination.perPage;
      return filteredAudienceLogRows.slice(start, start + pagination.perPage);
    }
    return logsList;
  }, [
    actualSessionId,
    logsList,
    filteredAudienceLogRows,
    pagination.page,
    pagination.perPage,
  ]);

  const effectiveMeta = useMemo(() => {
    if (actualSessionId && logsList.length > 0) return logsMeta;
    if (!actualSessionId) {
      const total = filteredAudienceLogRows.length;
      const lastPage = Math.max(1, Math.ceil(total / pagination.perPage));
      return {
        total,
        currentPage: pagination.page,
        lastPage,
        perPage: pagination.perPage,
        next: pagination.page < lastPage ? pagination.page + 1 : null,
        prev: pagination.page > 1 ? pagination.page - 1 : null,
      };
    }
    return logsMeta;
  }, [
    actualSessionId,
    logsList.length,
    logsMeta,
    filteredAudienceLogRows.length,
    pagination.page,
    pagination.perPage,
  ]);

  const columns = useCommsLogsTableColumns(channel);

  const table = useReactTable({
    manualPagination: true,
    data: displayData,
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
    <div className="p-4 space-y-4">
      {/* ── Header Section ── */}
      <div className="flex flex-col space-y-0">
        <Back path={backPath} />

        <div className="mt-1 flex flex-col pb-1 gap-2">
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
                <DialogComponent
                  buttonIcon={SendHorizontal}
                  buttonText={t('SEND_COMMUNICATION') || 'Send Communication'}
                  dialogTitle={t('SEND_COMMUNICATION') || 'Send Communication'}
                  dialogDescription={
                    t('SEND_COMMUNICATION_CONFIRM') ||
                    'Are you sure you want to send this communication?'
                  }
                  confirmButtonText={t('CONFIRM') || 'Confirm'}
                  handleClick={handleSend}
                  buttonClassName="gap-1.5 h-8 px-3.5 text-xs bg-primary text-white hover:!bg-primary/90 shrink-0 whitespace-nowrap"
                  confirmButtonClassName="rounded-sm bg-primary"
                  variant="default"
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Upper Overview Banner & Data Cards Grid ── */}
        <div className="flex flex-col lg:flex-row gap-4 w-full mt-2">
          {/* Left Overview Card */}
          <div className="flex-[2] min-w-0">
            <Card className="p-4 rounded-sm bg-white border border-gray-200 h-full flex flex-col justify-between shadow-none space-y-3">
              <div>
                <CardTitle className="flex items-center gap-2 pb-2">
                  <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1.5">
                    <CommunicationChannelIcon
                      channel={channel}
                      className="h-3.5 w-3.5"
                    />
                    {t(channel)}
                  </span>
                  <CommunicationStatusBadge
                    status={effectiveStatus}
                    isLoading={isBroadcastResolving}
                  />
                </CardTitle>

                <CardContent className="pl-0 pb-2 pt-1 flex flex-col gap-1">
                  <Label className="text-muted-foreground text-xs font-medium">
                    {t('COMMUNICATION_TITLE')}:
                  </Label>
                  <TooltipWrapper
                    tip={`${t('COMMUNICATION_TITLE')}: ${
                      rawComm?.title || ''
                    }`}
                  >
                    <Label className="text-base font-bold text-gray-900 leading-snug break-all">
                      {rawComm?.title || t('COMMUNICATION')}
                    </Label>
                  </TooltipWrapper>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
                </CardContent>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {channel === 'VOICE'
                    ? t('VOICE_RECORDING')
                    : t('MESSAGE_CONTENT')}
                </p>
                {channel === 'VOICE' && audioURL?.mediaURL ? (
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 space-y-1.5">
                    <p className="text-[11px] font-medium text-gray-600 truncate">
                      {audioURL.fileName || 'recording.wav'}
                    </p>
                    <audio
                      src={audioURL.mediaURL}
                      controls
                      className="w-full h-8 rounded"
                    />
                  </div>
                ) : messageText ? (
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto font-sans">
                    {messageText}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs text-muted-foreground italic">
                    {tg('N_A')}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2.5 mt-2.5 border-t border-gray-100">
                  <span>
                    {t('STARTED_AT')}:{' '}
                    {formatDate(
                      targetGroup?.createdAt || rawComm?.createdAt,
                      'MMMM d, yyyy, h:mm:ss a',
                    )}
                  </span>
                  <span>
                    {t('ENDED_AT')}:{' '}
                    {formatDate(
                      targetGroup?.updatedAt || rawComm?.updatedAt,
                      'MMMM d, yyyy, h:mm:ss a',
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right 4 Summary Data Cards */}
          <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-sm border border-gray-200 p-3 flex flex-col justify-between shadow-none min-h-[84px]">
              <span className="font-medium text-xs text-muted-foreground leading-snug">
                {t('SUCCESSFULLY_DELIVERED')}
              </span>
              {isLoadingComm || isLoadingLogs ? (
                <Skeleton className="h-6 w-12 mt-2" />
              ) : (
                <span className="text-primary font-semibold text-xl sm:text-2xl mt-1.5">
                  {formatNum(counts.SUCCESS)}
                </span>
              )}
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3 flex flex-col justify-between shadow-none min-h-[84px]">
              <span className="font-medium text-xs text-muted-foreground leading-snug">
                {t('FAILED_DELIVERED')}
              </span>
              {isLoadingComm || isLoadingLogs ? (
                <Skeleton className="h-6 w-12 mt-2" />
              ) : (
                <span className="text-primary font-semibold text-xl sm:text-2xl mt-1.5">
                  {formatNum(counts.FAIL)}
                </span>
              )}
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3 flex flex-col justify-between shadow-none min-h-[84px]">
              <span className="font-medium text-xs text-muted-foreground leading-snug">
                {tg('SCHEDULED')}
              </span>
              {isLoadingComm || isLoadingLogs ? (
                <Skeleton className="h-6 w-12 mt-2" />
              ) : (
                <span className="text-primary font-semibold text-xl sm:text-2xl mt-1.5">
                  {formatNum(counts.SCHEDULED)}
                </span>
              )}
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3 flex flex-col justify-between shadow-none min-h-[84px]">
              <span className="font-medium text-xs text-muted-foreground leading-snug">
                {tg('PENDING')}
              </span>
              {isLoadingComm || isLoadingLogs ? (
                <Skeleton className="h-6 w-12 mt-2" />
              ) : (
                <span className="text-primary font-semibold text-xl sm:text-2xl mt-1.5">
                  {formatNum(counts.PENDING)}
                </span>
              )}
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
                  <TabsContent value="details" className="p-4 space-y-3 m-0">
                    {/* Target Group */}
                    <div>
                      <p className="text-sm text-gray-500">
                        {targetGroup?.groupType
                          ? translateValue(tg, targetGroup.groupType, {
                              fallbackStyle: 'raw',
                            }) +
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
                        {formatDate(
                          targetGroup?.updatedAt || rawComm?.updatedAt,
                        )}
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

                    {targetGroup?.createdAt && (
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('STARTED_AT')}
                        </p>
                        <p className="font-medium">
                          {formatDate(targetGroup.createdAt)}
                        </p>
                      </div>
                    )}

                    {targetGroup?.updatedAt && (
                      <div>
                        <p className="text-sm text-gray-500">
                          {t('ENDED_AT')}
                        </p>
                        <p className="font-medium">
                          {formatDate(targetGroup.updatedAt)}
                        </p>
                      </div>
                    )}

                    {/* Channel / Transport Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <CommunicationChannelIcon
                            channel={channel}
                            className="h-5 w-5 text-gray-600"
                          />
                        </div>
                        <span className="font-medium">{t(channel)}</span>
                      </div>

                      <CommunicationStatusBadge
                        status={effectiveStatus}
                        isLoading={isBroadcastResolving}
                      />
                    </div>

                    {/* Communication Title & Subject & Message/Audio */}
                    <div className="space-y-3">
                      <TooltipWrapper
                        tip={`${t('COMMUNICATION_TITLE')}: ${
                          rawComm?.title || ''
                        }`}
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
                            <p className="font-medium">{rawComm.subject}</p>
                          </div>
                        </TooltipWrapper>
                      )}

                      <div>
                        {channel === 'VOICE' && audioURL?.mediaURL ? (
                          <div className="bg-gray-50 p-3 rounded-sm space-y-2 border border-gray-100">
                            <p className="text-center text-xs text-gray-600 font-medium">
                              {audioURL.fileName || 'recording.wav'}
                            </p>
                            <audio
                              src={audioURL.mediaURL}
                              controls
                              className="w-full h-10"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3 rounded-sm text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {typeof rawComm?.message === 'string' ? (
                              rawComm.message
                            ) : rawComm?.subject ? (
                              rawComm.subject
                            ) : (
                              <span className="text-gray-400 italic">
                                {tg('N_A')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="p-2 m-0 space-y-3">
                    {targetGroup ? (
                      <Card className="rounded-sm shadow-none border border-gray-100">
                        <CardContent className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {t('RUN_NUMBER', { number: formatNum(1) })}
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
        <Card className="col-span-1 md:col-span-2 w-full rounded-sm">
          <CardHeader className="flex flex-row items-center justify-center gap-2 pb-0 pt-0.5 space-y-0 px-2">
            <SearchInput
              className="w-full"
              value={filters?.address || ''}
              name={tGlobal('AUDIENCE')}
              onSearch={(e: any) => handleSearch(e, 'address')}
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
              isLoading={
                isLoadingLogs || (!actualSessionId && isLoadingAudience)
              }
            />
          </CardContent>

          <CardFooter className="justify-end pt-0 pb-0">
            <CustomPagination
              meta={effectiveMeta}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={effectiveMeta?.lastPage || 0}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
