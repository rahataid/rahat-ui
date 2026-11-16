'use client';

import Swal from 'sweetalert2';
import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLabelDigits, useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { Heading, Back, SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import {
  ArrowLeft,
  RefreshCcw,
  Trash,
  SendHorizontal,
  ArrowRight,
  Pencil,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  Hourglass,
  CloudDownload,
  LoaderCircle,
} from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { toast } from 'react-toastify';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import {
  useDeleteCommunication,
  useGetCommunication,
  useListAllTransports,
  useListSessionLogs,
  useTriggerCommunicationBroadcast,
  useBeneficiariesGroups,
  useStakeholdersGroups,
  useSessionBroadCastCount,
  useSessionRetryFailed,
} from '@rahat-ui/query';
import { toCommunicationRecord } from '../components/useCommunicationsTableColumns';
import { CommunicationStatusBadge } from '../components/communication-status-badge';
import { CommunicationChannelIcon } from '../components/communication-channel-icon';
import { SendCommunicationConfirmDialog } from '../components/send-communication-confirm-dialog';
import {
  resolveChannelByTransportId,
  resolveTargetEffectiveStatus,
  resolveCommunicationLifecycleStatus,
  exportCommunicationLogs,
  exportCommunicationTargetSummary,
} from '../utils/communications.utils';
import { UUID } from 'crypto';

export default function CommunicationDetailsView() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const commId = params.commId as string;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);

  const appTransports = useListAllTransports();
  const { data: communication, isLoading, isError, refetch, isFetching } = useGetCommunication(
    projectId as UUID,
    commId,
  );
  const deleteCommunication = useDeleteCommunication();
  const triggerBroadcast = useTriggerCommunicationBroadcast();
  const retryFailedSession = useSessionRetryFailed();
  const [isRetrying, setIsRetrying] = useState(false);
  const { data: beneficiaryGroupsData } = useBeneficiariesGroups(projectId as UUID, { page: 1, perPage: 100 });
  const { data: stakeholderGroupsData } = useStakeholdersGroups(projectId as UUID, { page: 1, perPage: 100 });
  const isMutating =
    deleteCommunication.isPending ||
    triggerBroadcast.isPending ||
    retryFailedSession.isPending ||
    isRetrying;

  const communicationsListPath = `/projects/aa/${projectId}/communications`;

  const raw = (communication as any)?.data ?? communication;
  const targets = Array.isArray(raw?.targets) ? raw.targets : [];

  const sessionIds = useMemo(() => {
    const ids: string[] = [];
    if (Array.isArray(targets)) {
      targets.forEach((target: any) => {
        if (target.sessionId) ids.push(target.sessionId);
      });
    }
    return [...new Set(ids)];
  }, [targets]);

  const getGroupDetails = (groupId: string, groupType: string, targetGroupObj?: any) => {
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

    const found = (rawList as any[]).find((g: any) => g?.uuid === groupId || g?.id === groupId);
    if (found) {
      const count = isBeneficiary
        ? (found._count?.beneficiaries ?? found?.groupedBeneficiaries?.length ?? found?.beneficiaries?.length ?? 0)
        : (found._count?.stakeholders ?? found?.stakeholders?.length ?? 0);
      return { name: found.name, count };
    }

    return { name: groupId || (isBeneficiary ? t('BENEFICIARY_GROUP') : t('STAKEHOLDER_GROUP')), count: 0 };
  };

  const failedTargetsAudienceCount = targets
    .filter((t: any) => t?.status === 'FAILED')
    .reduce((sum: number, target: any) => {
      const info = getGroupDetails(target.groupId, target.groupType, target.group);
      return sum + (info.count || 0);
    }, 0);

  const { data: broadcastCounts, isLoading: isBroadcastLoading } = useSessionBroadCastCount(sessionIds);
  const isBroadcastResolving = sessionIds.length > 0 && (isBroadcastLoading || broadcastCounts === undefined);

  const rawBroadcastCounts =
    (broadcastCounts as any)?.data?.data ??
    (broadcastCounts as any)?.data ??
    broadcastCounts;

  const deliveredCount = rawBroadcastCounts?.SUCCESS ?? 0;
  const scheduledCount = rawBroadcastCounts?.SCHEDULED ?? 0;
  const failedCount = rawBroadcastCounts?.FAIL ?? 0;
  const pendingCountBroadcast = rawBroadcastCounts?.PENDING ?? 0;

  const record = useMemo(() => {
    if (!raw) return null;
    return toCommunicationRecord(
      raw,
      resolveChannelByTransportId(appTransports, raw?.transportId, raw?.audioURL),
    );
  }, [raw, appTransports]);

  const effectiveOverallStatus = useMemo(() => {
    return resolveCommunicationLifecycleStatus({
      channel: record?.channel || raw?.channel || 'SMS',
      rawStatus: record?.status || raw?.status,
      counts: sessionIds.length > 0 ? rawBroadcastCounts : undefined,
      hasActiveTargets:
        targets.some((t: any) => t?.status === 'PROCESSING'),
      hasPendingTargets: targets.some((t: any) => t?.status === 'PENDING' || !t?.status),
      hasSession: sessionIds.length > 0,
      isRetrying: isRetrying || retryFailedSession.isPending || triggerBroadcast.isPending,
    });
  }, [
    record?.channel,
    raw?.channel,
    record?.status,
    raw?.status,
    rawBroadcastCounts,
    sessionIds.length,
    targets,
    isRetrying,
    retryFailedSession.isPending,
    triggerBroadcast.isPending,
  ]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-65px)] p-4">
        <Back path={communicationsListPath} />
        <div className="h-full flex flex-col justify-center items-center space-y-3">
          <p className="text-gray-500 text-sm">{t('LOADING')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[calc(100vh-65px)] p-4">
        <Back path={communicationsListPath} />
        <div className="h-full flex flex-col justify-center items-center space-y-3">
          <p className="text-gray-500 text-sm">{t('ERROR')}</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-primary hover:underline text-sm flex items-center font-medium disabled:opacity-50"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> {t('RETRY_COMMUNICATION') || 'Retry Communication'}
          </button>
        </div>
      </div>
    );
  }

  if (!raw?.uuid) {
    return (
      <div className="h-[calc(100vh-65px)] p-4">
        <Back path={communicationsListPath} />
        <div className="h-full flex flex-col justify-center items-center space-y-3">
          <p className="text-gray-500 text-sm">{t('COMMUNICATION_NOT_FOUND')}</p>
          <button
            onClick={() => router.push(communicationsListPath)}
            className="text-primary hover:underline text-sm flex items-center font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('GO_BACK')}
          </button>
        </div>
      </div>
    );
  }



  const hasFailedTargets = targets.some((target: any) => target?.status === 'FAILED');
  const hasPendingTargets = targets.some(
    (target: any) => target?.status === 'PENDING' || target?.status === 'PROCESSING',
  );

  const canSend =
    targets.length > 0 &&
    sessionIds.length === 0 &&
    targets.every((target: any) => target?.status === 'PENDING');

  const canRetry = (failedCount > 0 || hasFailedTargets) && !isRetrying;

  const filteredTargets = targets.filter((target: any) => {
    const groupInfo = getGroupDetails(target?.groupId, target?.groupType, target?.group);
    const matchesSearch =
      !searchTerm ||
      groupInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (target?.groupId && target.groupId.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      const rawStatus = (target?.status || '').toUpperCase();
      if (statusFilter === 'COMPLETED') {
        matchesStatus =
          rawStatus === 'COMPLETED' ||
          rawStatus === 'DELIVERED' ||
          rawStatus === 'SUCCESS' ||
          rawStatus === 'SENT' ||
          rawStatus === 'ANSWERED';
      } else if (statusFilter === 'FAILED') {
        matchesStatus = rawStatus === 'FAILED' || rawStatus === 'FAIL';
      } else if (statusFilter === 'IN_PROGRESS') {
        matchesStatus = rawStatus === 'IN_PROGRESS' || rawStatus === 'PROCESSING';
      } else if (statusFilter === 'NOT_STARTED' || statusFilter === 'PENDING') {
        matchesStatus =
          rawStatus === 'NOT_STARTED' ||
          rawStatus === 'PENDING' ||
          rawStatus === 'NEW' ||
          !rawStatus ||
          rawStatus === 'SCHEDULED';
      } else {
        matchesStatus = rawStatus === statusFilter.toUpperCase();
      }
    }

    return matchesSearch && matchesStatus;
  });

  const handleSendConfirm = () => {
    if (isMutating) return;
    triggerBroadcast.mutate({
      projectUUID: projectId as UUID,
      communicationUUID: commId,
    });
  };

  const handleRetryConfirm = async () => {
    if (isMutating || isRetrying) return;
    setIsRetrying(true);
    try {
      const retryPromises: Promise<any>[] = [];

      const failedSessionIds = targets
        .filter(
          (t: any) =>
            t?.sessionId &&
            (t?.status === 'FAILED' || t?.status === 'FAIL'),
        )
        .map((t: any) => t.sessionId);

      const candidateSessionIds =
        failedSessionIds.length > 0
          ? failedSessionIds
          : targets
              .filter((t: any) => {
                if (!t?.sessionId) return false;
                const s = (t?.status || '').toUpperCase();
                return (
                  s !== 'COMPLETED' &&
                  s !== 'SUCCESS' &&
                  s !== 'DELIVERED' &&
                  s !== 'ANSWERED'
                );
              })
              .map((t: any) => t.sessionId);

      if (candidateSessionIds.length > 0) {
        retryPromises.push(
          ...candidateSessionIds.map((cuid: string) =>
            retryFailedSession.mutateAsync({ cuid, includeFailed: true }),
          ),
        );
      }

      const hasUnsentOrFailedTargets = targets.some(
        (target: any) =>
          !target?.sessionId &&
          (target?.status === 'FAILED' ||
            target?.status === 'FAIL' ||
            target?.status === 'PENDING'),
      );

      if (hasUnsentOrFailedTargets) {
        retryPromises.push(
          triggerBroadcast.mutateAsync({
            projectUUID: projectId as UUID,
            communicationUUID: commId,
          }),
        );
      }

      if (retryPromises.length > 0) {
        await Promise.all(retryPromises);
      }
      await refetch();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (isMutating) return;
    deleteCommunication.mutate(
      {
        projectUUID: projectId as UUID,
        communicationUUID: commId,
      },
      {
        onSuccess: () => router.push(communicationsListPath),
      },
    );
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-3.5">
      {/* ── Header Section ── */}
      <div className="flex flex-col space-y-0">
        <Back path={communicationsListPath} />

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0.5">
          <div>
            <Heading
              title={t('COMMUNICATION_DETAILS')}
              description={t('SELECT_COMMUNICATION_TO_VIEW') || 'Select a target group to view its details'}
            />
            {raw?.updatedAt && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('UPDATED_AT')}: {formatDate(raw.updatedAt, 'MMMM d, yyyy, h:mm:ss a') || raw.updatedAt}
              </p>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <DialogComponent
              buttonIcon={Pencil}
              buttonText={t('EDIT')}
              dialogTitle={t('EDIT_COMMUNICATION')}
              dialogDescription={t('EDIT_COMMUNICATION_CONFIRM')}
              confirmButtonText={t('CONFIRM')}
              handleClick={() =>
                router.push(
                  `/projects/aa/${projectId}/communications/${commId}/edit`,
                )
              }
              buttonClassName="rounded-sm text-xs h-8 px-3"
              confirmButtonClassName="rounded-sm bg-primary"
              variant="outline"
            />

            <DialogComponent
              buttonIcon={Trash}
              buttonText={t('DELETE')}
              dialogTitle={t('DELETE_COMMUNICATION')}
              dialogDescription={t('DELETE_COMMUNICATION_CONFIRM')}
              confirmButtonText={t('CONFIRM')}
              handleClick={handleDeleteConfirm}
              buttonClassName="rounded-sm text-red-500 border-red-500 text-xs h-8 px-3"
              confirmButtonClassName="rounded-sm bg-red-500"
              variant="outline"
            />

            {canSend && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-sm text-xs h-8 px-3 gap-1.5"
                onClick={() => setIsSendConfirmOpen(true)}
                disabled={isMutating}
              >
                <SendHorizontal className="w-4 h-4 text-primary" />
                {t('SEND_COMMUNICATION') || 'Send Communication'}
              </Button>
            )}

            {canRetry && (
              <DialogComponent
                buttonIcon={RefreshCcw}
                buttonText={t('RETRY_FAILED') || 'Retry Failed'}
                dialogTitle={t('RETRY_COMMUNICATION') || 'Retry Communication'}
                dialogDescription={t('RETRY_COMMUNICATION_CONFIRM') || 'Are you sure you want to retry sending failed messages for this communication?'}
                confirmButtonText={t('CONFIRM')}
                handleClick={handleRetryConfirm}
                buttonClassName="rounded-sm text-xs h-8 px-3 gap-1.5"
                confirmButtonClassName="rounded-sm bg-primary"
                variant="outline"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Communication Main Banner & 4 Top Data Cards ── */}
      <div className="space-y-3">
        {/* Title & Channel Header Card */}
        <Card className="p-3.5 sm:p-4 rounded-sm bg-white border border-gray-200/90 shadow-none flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded border border-slate-200/80 flex items-center gap-1.5">
                <CommunicationChannelIcon channel={record?.channel || 'SMS'} className="h-3.5 w-3.5 text-slate-600" />
                {t(record?.channel || 'SMS')}
              </span>
              <CommunicationStatusBadge status={effectiveOverallStatus} isLoading={isBroadcastResolving} />
            </div>
            <div className="pt-0.5 min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{t('COMMUNICATION_TITLE')}:</span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug break-words break-all [overflow-wrap:anywhere]">
                {record?.title || raw?.title || ''}
              </h2>
            </div>
          </div>
        </Card>

        {/* 4 Summary Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="bg-white rounded-sm border border-gray-200/90 p-3 sm:p-3.5 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-medium text-xs text-muted-foreground leading-snug line-clamp-2" title={t('SUCCESSFULLY_DELIVERED') || 'Successfully Delivered'}>
                {t('SUCCESSFULLY_DELIVERED') || 'Successfully Delivered'}
              </span>
              <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              {isBroadcastResolving ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <span className="text-primary font-bold text-xl sm:text-2xl tracking-tight leading-none">
                  {formatNum(deliveredCount)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-sm border border-gray-200/90 p-3 sm:p-3.5 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-medium text-xs text-muted-foreground leading-snug line-clamp-2" title={t('FAILED_DELIVERED') || 'Failed Delivered'}>
                {t('FAILED_DELIVERED') || 'Failed Delivered'}
              </span>
              <div className="h-6 w-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              {isBroadcastResolving ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <span className="text-primary font-bold text-xl sm:text-2xl tracking-tight leading-none">
                  {formatNum(failedCount)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-sm border border-gray-200/90 p-3 sm:p-3.5 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-medium text-xs text-muted-foreground leading-snug line-clamp-2" title={tg('SCHEDULED') || 'Scheduled'}>
                {tg('SCHEDULED') || 'Scheduled'}
              </span>
              <div className="h-6 w-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <CalendarClock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              {isBroadcastResolving ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <span className="text-primary font-bold text-xl sm:text-2xl tracking-tight leading-none">
                  {formatNum(scheduledCount)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-sm border border-gray-200/90 p-3 sm:p-3.5 flex flex-col justify-between shadow-none hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-1.5">
              <span className="font-medium text-xs text-muted-foreground leading-snug line-clamp-2" title={tg('PENDING') || 'Pending'}>
                {tg('PENDING') || 'Pending'}
              </span>
              <div className="h-6 w-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Hourglass className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              {isBroadcastResolving ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <span className="text-primary font-bold text-xl sm:text-2xl tracking-tight leading-none">
                  {formatNum(pendingCountBroadcast)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Target Group Cards Grid (matching Activity Communication Details) ── */}
      <Card className="bg-white rounded-sm border border-gray-200/90 p-3.5 sm:p-4 space-y-3.5 shadow-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <SearchInput
              name="search-audience"
              placeholder={t('SEARCH_AUDIENCE') || 'Search Audience...'}
              value={searchTerm}
              onSearch={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <SelectComponent
              options={[
                { label: tg('ALL') || 'All Statuses', value: 'ALL' },
                { label: t('COMPLETED') || 'Completed', value: 'COMPLETED' },
                { label: t('FAILED') || 'Failed', value: 'FAILED' },
                { label: t('IN_PROGRESS') || 'In Progress', value: 'IN_PROGRESS' },
                { label: t('NOT_STARTED') || 'Not Started', value: 'NOT_STARTED' },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
            />
          </div>
        </div>

        {filteredTargets.length === 0 ? (
          <div className="py-12 border border-dashed border-gray-200 rounded-sm text-center text-muted-foreground italic">
            {t('NO_AUDIENCE_FOUND') || 'No audience records found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTargets.map((target: any) => {
              const groupInfo = getGroupDetails(target?.groupId, target?.groupType, target?.group);
              return (
                <TargetGroupCardItem
                  key={target.uuid}
                  target={target}
                  groupInfo={groupInfo}
                  record={record}
                  raw={raw}
                  refetch={refetch}
                  onViewDetails={() => {
                    const identifier = target.sessionId || target.uuid || target.groupId;
                    router.push(`/projects/aa/${projectId}/communications/${commId}/logs/${identifier}`);
                  }}
                />
              );
            })}
          </div>
        )}
      </Card>

      <SendCommunicationConfirmDialog
        isOpen={isSendConfirmOpen}
        onClose={() => setIsSendConfirmOpen(false)}
        onConfirm={async () => {
          handleSendConfirm();
          setIsSendConfirmOpen(false);
        }}
        isPending={isMutating}
        title={record?.title || raw?.title}
        channel={record?.channel || raw?.channel}
        recipientsCount={targets.reduce((acc: number, trg: any) => acc + (trg?.group?.count || 0), 0)}
        groupsCount={targets.length}
      />
    </div>
  );
}

function TargetGroupCardItem({
  target,
  groupInfo,
  record,
  raw,
  refetch,
  onViewDetails,
}: {
  target: any;
  groupInfo: { name: string; count: number };
  record: any;
  raw: any;
  refetch: () => void;
  onViewDetails: () => void;
}) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const params = useParams();
  const projectId = params.id as string;
  const commId = params.commId as string;

  const { data: broadcastCounts, isLoading: isGroupBroadcastLoading } = useSessionBroadCastCount(target?.sessionId ? [target.sessionId] : []);
  const mutateRetry = useSessionRetryFailed();
  const triggerBroadcast = useTriggerCommunicationBroadcast();

  const isTargetResolving = !!target?.sessionId && (isGroupBroadcastLoading || broadcastCounts === undefined);

  const { data: sessionLogs, isLoading: isLoadingSessionLogs } =
    useListSessionLogs(target?.sessionId || '', {
      page: 1,
      perPage: 1000,
    });

  const sessionLogsList = useMemo(() => {
    const raw =
      (sessionLogs as any)?.data ??
      (sessionLogs as any)?.httpReponse?.data?.data ??
      [];
    return Array.isArray(raw) ? raw : [];
  }, [sessionLogs]);

  const rawGroupCounts =
    (broadcastCounts as any)?.data?.data ??
    (broadcastCounts as any)?.data ??
    broadcastCounts;

  const delivered = rawGroupCounts?.SUCCESS ?? 0;
  const failed = rawGroupCounts?.FAIL ?? 0;
  const audioURL = typeof raw?.audioURL === 'object' ? raw.audioURL : null;
  const messageText =
    typeof raw?.message === 'string' && raw.message.trim()
      ? raw.message
      : raw?.subject || record.description || null;

  const isRetrying = mutateRetry.isPending || triggerBroadcast.isPending;

  const effectiveTargetStatus = useMemo(() => {
    return resolveCommunicationLifecycleStatus({
      channel: record.channel,
      rawStatus: target?.status,
      counts: target?.sessionId ? rawGroupCounts : undefined,
      hasActiveTargets: target?.status === 'PROCESSING',
      hasPendingTargets: target?.status === 'PENDING' || !target?.status,
      hasSession: !!target?.sessionId,
      isRetrying: (failed > 0 || target?.status === 'FAILED') && isRetrying,
    });
  }, [target?.status, target?.sessionId, rawGroupCounts, record.channel, isRetrying, failed]);

  const handleRetry = async () => {
    if (isRetrying) return;
    try {
      if (target?.sessionId) {
        await mutateRetry.mutateAsync({ cuid: target.sessionId, includeFailed: true });
      } else {
        await triggerBroadcast.mutateAsync({
          projectUUID: projectId as UUID,
          communicationUUID: commId,
        });
      }
      refetch();
    } catch (error) {
      console.error('Retry error:', error);
    }
  };

  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isExportingFailed, setIsExportingFailed] = useState(false);

  const hasNoFailedDeliveries =
    failed === 0 &&
    sessionLogsList.filter(
      (l: any) =>
        (l?.status || '').toUpperCase() === 'FAIL' ||
        (l?.status || '').toUpperCase() === 'FAILED',
    ).length === 0;

  const hasNoLogsForExport =
    !target?.sessionId ||
    (delivered === 0 &&
      failed === 0 &&
      sessionLogsList.length === 0 &&
      (rawGroupCounts?.TOTAL ?? 0) === 0);

  const handleExportFailed = async () => {
    if (isExportingFailed || hasNoFailedDeliveries) return;
    setIsExportingFailed(true);
    try {
      const logs = sessionLogsList.length > 0 ? sessionLogsList : [];
      const success = await exportCommunicationLogs(logs, {
        title: record?.title || raw?.title,
        groupName: groupInfo.name,
        groupType: target?.groupType,
        channel: record?.channel,
        onlyFailed: true,
        message: typeof raw?.message === 'string' ? raw.message : undefined,
        subject: raw?.subject,
        sessionStartedAt: target?.createdAt || raw?.createdAt,
        sessionEndedAt: target?.updatedAt || raw?.updatedAt,
        formatDate: (d) => formatDate(d, 'MMMM d, yyyy, h:mm:ss a'),
        naLabel: tg('N_A'),
      });
      if (success) {
        toast.success(t('LOGS_EXPORTED_SUCCESSFULLY') || 'Logs exported successfully');
      } else {
        toast.info(t('NO_FAILED_DELIVERIES_TO_EXPORT') || 'No failed deliveries to export');
      }
    } catch (error) {
      console.error('Error exporting failed logs:', error);
      toast.error(t('FAILED_EXPORT_LOGS') || 'Failed to export logs');
    } finally {
      setIsExportingFailed(false);
    }
  };

  const handleExportAll = async () => {
    if (isExportingAll || hasNoLogsForExport) return;
    setIsExportingAll(true);
    try {
      const logs = sessionLogsList.length > 0 ? sessionLogsList : [];
      const success = await exportCommunicationLogs(logs, {
        title: record?.title || raw?.title,
        groupName: groupInfo.name,
        groupType: target?.groupType,
        channel: record?.channel,
        onlyFailed: false,
        message: typeof raw?.message === 'string' ? raw.message : undefined,
        subject: raw?.subject,
        sessionStartedAt: target?.createdAt || raw?.createdAt,
        sessionEndedAt: target?.updatedAt || raw?.updatedAt,
        formatDate: (d) => formatDate(d, 'MMMM d, yyyy, h:mm:ss a'),
        naLabel: tg('N_A'),
      });
      if (success) {
        toast.success(t('LOGS_EXPORTED_SUCCESSFULLY') || 'Logs exported successfully');
      } else {
        toast.info(t('NO_COMMUNICATION_LOGS_AVAILABLE_TO_EXPORT') || 'No communication logs available to export');
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error(t('FAILED_EXPORT_LOGS') || 'Failed to export logs');
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <Card className="bg-white border border-gray-200/90 rounded-sm shadow-none flex flex-col justify-between p-3.5 sm:p-4 space-y-3 hover:border-gray-300 transition-colors">
      <div className="space-y-2.5">
        {/* Header Row: Channel Icon + Title/Subtitle + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 shrink-0">
              <CommunicationChannelIcon channel={record.channel} className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">{groupInfo.name}</h4>
              <p className="text-xs text-gray-500 truncate">
                {t(record.channel ? record.channel.toUpperCase() : 'SMS')} • {target?.groupType === 'BENEFICIARY' ? t('BENEFICIARY') : t('STAKEHOLDER')} • {groupInfo.name}
              </p>
            </div>
          </div>
          <CommunicationStatusBadge status={effectiveTargetStatus} isLoading={isTargetResolving} />
        </div>

        {/* Voice Player or Message Preview */}
        {record.channel === 'VOICE' && audioURL?.mediaURL ? (
          <div className="bg-slate-50/80 p-2 sm:p-2.5 rounded border border-gray-200/80 space-y-1">
            <p className="text-[11px] font-medium text-gray-600 truncate">{audioURL.fileName || 'recording.wav'}</p>
            <audio
              src={audioURL.mediaURL}
              controls
              aria-label={audioURL.fileName || t('VOICE_RECORDING') || 'Voice recording'}
              title={audioURL.fileName || 'Audio recording'}
              className="w-full h-8 rounded"
            />
          </div>
        ) : messageText ? (
          <div className="bg-slate-50/80 p-2 sm:p-2.5 rounded border border-gray-200/80 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto font-sans break-words break-all [overflow-wrap:anywhere]">
            {messageText}
          </div>
        ) : null}

        {/* Deliveries Count */}
        {isTargetResolving ? (
          <Skeleton className="h-4 w-44 mt-0.5 rounded" />
        ) : (
          <div className="text-xs text-gray-500 font-medium pt-0.5">
            {formatNum(delivered)} {t('DELIVERED')?.toLowerCase() || 'delivered'} · {formatNum(failed)} {t('FAILED')?.toLowerCase() || 'failed'} ({formatNum(groupInfo.count)} {target?.groupType === 'BENEFICIARY' ? t('BENEFICIARIES') : t('STAKEHOLDERS')})
          </div>
        )}
      </div>

      {/* Footer Section: Timestamps on Left + Buttons on Right */}
      <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-gray-500">
          {effectiveTargetStatus === 'COMPLETED' || target?.status === 'COMPLETED' ? (
            <p>
              {t('COMPLETED_AT') || 'Completed At'}:{' '}
              {formatDate(
                target?.completedAt || target?.updatedAt || raw?.updatedAt,
                'MMMM d, yyyy at h:mm:ss a',
              )}
            </p>
          ) : (
            <p>
              {t('UPDATED_AT') || 'Updated at'}:{' '}
              {formatDate(
                target?.updatedAt || raw?.updatedAt,
                'MMMM d, yyyy at h:mm:ss a',
              )}
            </p>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-2 ml-auto">
          {(failed > 0 || target?.status === 'FAILED') && (
            <DialogComponent
              buttonIcon={RefreshCcw}
              buttonText={tg('RETRY') || 'Retry'}
              dialogTitle={t('RETRY_COMMUNICATION') || 'Retry Communication'}
              dialogDescription={t('RETRY_COMMUNICATION_CONFIRM') || 'Are you sure you want to retry this communication?'}
              confirmButtonText={t('CONFIRM') || 'Confirm'}
              handleClick={handleRetry}
              buttonClassName="h-8 text-xs font-medium px-3.5 gap-1.5 rounded-sm shrink-0 whitespace-nowrap"
              confirmButtonClassName="rounded-sm bg-primary"
              variant="outline"
            />
          )}

          <TooltipWrapper
            tip={t('NO_FAILED_DELIVERIES_TO_EXPORT')}
            disable={!hasNoFailedDeliveries}
          >
            <DialogComponent
              buttonIcon={CloudDownload}
              buttonText={isExportingFailed ? t('EXPORTING') || 'Exporting...' : t('FAILED_EXPORTS') || 'Failed Exports'}
              dialogTitle={t('EXPORT_FAILED_COMMUNICATION_LOGS') || 'Export Failed Communication Logs'}
              dialogDescription={t('EXPORT_FAILED_COMMUNICATION_LOGS_CONFIRM') || 'Are you sure you want to export failed communication logs for this group?'}
              confirmButtonText={t('CONFIRM') || 'Confirm'}
              handleClick={handleExportFailed}
              buttonClassName="h-8 text-xs font-medium px-3 gap-1.5 rounded-sm shrink-0 whitespace-nowrap"
              confirmButtonClassName="rounded-sm bg-primary"
              variant="outline"
              data={{ _count: { Activity: hasNoFailedDeliveries || isExportingFailed ? 1 : 0 } }}
            />
          </TooltipWrapper>

          <TooltipWrapper
            tip={t('NO_COMMUNICATION_LOGS_AVAILABLE_TO_EXPORT')}
            disable={!hasNoLogsForExport}
          >
            <DialogComponent
              buttonIcon={CloudDownload}
              buttonText={isExportingAll ? t('EXPORTING') || 'Exporting...' : t('EXPORT_ALL_LOGS') || 'Export All Logs'}
              dialogTitle={t('EXPORT_COMMUNICATION_LOGS') || 'Export Communication Logs'}
              dialogDescription={t('EXPORT_COMMUNICATION_LOGS_CONFIRM') || 'Are you sure you want to export all communication logs for this group?'}
              confirmButtonText={t('CONFIRM') || 'Confirm'}
              handleClick={handleExportAll}
              buttonClassName="h-8 text-xs font-medium px-3 gap-1.5 rounded-sm shrink-0 whitespace-nowrap"
              confirmButtonClassName="rounded-sm bg-primary"
              variant="outline"
              data={{ _count: { Activity: hasNoLogsForExport || isExportingAll ? 1 : 0 } }}
            />
          </TooltipWrapper>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50 font-medium shrink-0"
            onClick={onViewDetails}
          >
            <span>{t('VIEW_DETAILS') || 'View Details'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
