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
} from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import {
  useDeleteCommunication,
  useGetCommunication,
  useListAllTransports,
  useTriggerCommunicationBroadcast,
  useBeneficiariesGroups,
  useStakeholdersGroups,
  useSessionBroadCastCount,
  useSessionRetryFailed,
} from '@rahat-ui/query';
import { toCommunicationRecord } from '../components/useCommunicationsTableColumns';
import { CommunicationStatusBadge } from '../components/communication-status-badge';
import { CommunicationChannelIcon } from '../components/communication-channel-icon';
import {
  resolveChannelByTransportId,
  resolveTargetEffectiveStatus,
  resolveCommunicationLifecycleStatus,
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

  const pendingTargetsAudienceCount = targets
    .filter((t: any) => t?.status === 'PENDING' || t?.status === 'PROCESSING')
    .reduce((sum: number, target: any) => {
      const info = getGroupDetails(target.groupId, target.groupType, target.group);
      return sum + (info.count || 0);
    }, 0);

  const { data: broadcastCounts, isLoading: isBroadcastLoading } = useSessionBroadCastCount(sessionIds);
  const isBroadcastResolving = sessionIds.length > 0 && (isBroadcastLoading || broadcastCounts === undefined);
  const deliveredCount = broadcastCounts?.data?.SUCCESS ?? 0;
  const failedCount = (broadcastCounts?.data?.FAIL ?? 0) + failedTargetsAudienceCount;
  const pendingCountBroadcast = (broadcastCounts?.data?.PENDING ?? 0) + pendingTargetsAudienceCount;
  const scheduledCount = broadcastCounts?.data?.SCHEDULED ?? 0;

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
      counts: broadcastCounts?.data,
      hasActiveTargets:
        sessionIds.length > 0 ||
        targets.some((t: any) => t?.status === 'SENT' || t?.status === 'PROCESSING'),
      hasPendingTargets: targets.some((t: any) => t?.status === 'PENDING'),
      hasSession: sessionIds.length > 0,
      isRetrying: isRetrying || retryFailedSession.isPending || triggerBroadcast.isPending,
    });
  }, [
    record?.channel,
    raw?.channel,
    record?.status,
    raw?.status,
    broadcastCounts?.data,
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
            <RefreshCcw className="w-4 h-4 mr-2" /> {t('RETRY_BROADCAST')}
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

    const matchesStatus =
      statusFilter === 'ALL' ||
      target?.status?.toUpperCase() === statusFilter.toUpperCase();

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
      if (sessionIds.length > 0) {
        await Promise.all(
          sessionIds.map((cuid) =>
            retryFailedSession.mutateAsync({ cuid, includeFailed: true }),
          ),
        );
      } else {
        await triggerBroadcast.mutateAsync({
          projectUUID: projectId as UUID,
          communicationUUID: commId,
        });
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
    <div className="p-4 space-y-4">
      {/* ── Header Section ── */}
      <div className="flex flex-col space-y-0">
        <Back path={communicationsListPath} />

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <Heading
              title={t('COMMUNICATION_DETAILS')}
              description={t('SELECT_COMMUNICATION_TO_VIEW') || 'Select a target group to view its details'}
            />
            {raw?.updatedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('UPDATED_AT')}: {formatDate(raw.updatedAt, 'MMMM d, yyyy, h:mm:ss a') || raw.updatedAt}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <DialogComponent
              buttonIcon={Trash}
              buttonText={t('DELETE')}
              dialogTitle={t('DELETE_COMMUNICATION')}
              dialogDescription={t('DELETE_COMMUNICATION_CONFIRM')}
              confirmButtonText={t('CONFIRM')}
              handleClick={handleDeleteConfirm}
              buttonClassName="rounded-sm text-red-500 border-red-500 text-xs h-9 px-3"
              confirmButtonClassName="rounded-sm bg-red-500"
              variant="outline"
            />

            {canSend && (
              <DialogComponent
                buttonIcon={SendHorizontal}
                buttonText={t('SEND_BROADCAST')}
                dialogTitle={t('SEND_BROADCAST')}
                dialogDescription={t('SEND_BROADCAST_CONFIRM')}
                confirmButtonText={t('CONFIRM')}
                handleClick={handleSendConfirm}
                buttonClassName="rounded-sm text-xs h-9 px-3 gap-1.5"
                confirmButtonClassName="rounded-sm bg-primary"
                variant="outline"
              />
            )}

            {canRetry && (
              <DialogComponent
                buttonIcon={RefreshCcw}
                buttonText={t('RETRY_FAILED') || 'Retry Failed'}
                dialogTitle={t('RETRY_BROADCAST') || 'Retry Broadcast'}
                dialogDescription={t('RETRY_COMMUNICATION_CONFIRM') || 'Are you sure you want to retry sending failed messages for this broadcast?'}
                confirmButtonText={t('CONFIRM')}
                handleClick={handleRetryConfirm}
                buttonClassName="rounded-sm text-xs h-9 px-3 gap-1.5"
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
        <Card className="p-4 rounded-sm bg-white border border-gray-200 shadow-none flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1.5">
                <CommunicationChannelIcon channel={record?.channel || 'SMS'} className="h-3.5 w-3.5" />
                {t(record?.channel || 'SMS')}
              </span>
              <CommunicationStatusBadge status={effectiveOverallStatus} isLoading={isBroadcastResolving} />
            </div>
            <div className="pt-1">
              <span className="text-xs text-muted-foreground font-medium">{t('COMMUNICATION_TITLE')}:</span>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{record?.title || raw?.title || ''}</h2>
            </div>
          </div>
        </Card>

        {/* 4 Summary Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
            <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-1">{t('SUCCESSFULLY_DELIVERED') || 'Successfully Delivered'}</h1>
            {isBroadcastResolving ? (
              <Skeleton className="h-7 w-16 mt-2" />
            ) : (
              <p className="text-primary font-semibold text-2xl mt-2">{formatNum(deliveredCount)}</p>
            )}
          </div>
          <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
            <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-1">{t('FAILED_DELIVERED') || 'Failed Delivered'}</h1>
            {isBroadcastResolving ? (
              <Skeleton className="h-7 w-16 mt-2" />
            ) : (
              <p className="text-primary font-semibold text-2xl mt-2">{formatNum(failedCount)}</p>
            )}
          </div>
          <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
            <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-1">{tg('SCHEDULED') || 'Scheduled'}</h1>
            {isBroadcastResolving ? (
              <Skeleton className="h-7 w-16 mt-2" />
            ) : (
              <p className="text-primary font-semibold text-2xl mt-2">{formatNum(scheduledCount)}</p>
            )}
          </div>
          <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
            <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-1">{tg('PENDING') || 'Pending'}</h1>
            {isBroadcastResolving ? (
              <Skeleton className="h-7 w-16 mt-2" />
            ) : (
              <p className="text-primary font-semibold text-2xl mt-2">{formatNum(pendingCountBroadcast)}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Target Group Cards Grid (matching Activity Communication Details) ── */}
      <Card className="bg-white rounded-sm border border-gray-200 p-4 space-y-4 shadow-none">
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
                { label: t('ALL_STATUSES') || 'Select Status', value: 'ALL' },
                { label: t('PENDING'), value: 'PENDING' },
                { label: t('PROCESSING') || 'Processing', value: 'PROCESSING' },
                { label: t('SENT') || 'Sent', value: 'SENT' },
                { label: t('FAILED'), value: 'FAILED' },
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
                    if (target.sessionId) {
                      router.push(`/projects/aa/${projectId}/communications/${commId}/logs/${target.sessionId}`);
                    } else {
                      Swal.fire(t('NO_SESSION_CREATED') || 'No broadcast session was created for this group.', '', 'info');
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </Card>
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

  const delivered = broadcastCounts?.data?.SUCCESS ?? 0;
  const failed = broadcastCounts?.data?.FAIL ?? 0;
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
      counts: broadcastCounts?.data,
      hasActiveTargets: target?.status === 'SENT' || target?.status === 'PROCESSING',
      hasPendingTargets: target?.status === 'PENDING',
      hasSession: !!target?.sessionId,
      isRetrying,
    });
  }, [target?.status, broadcastCounts?.data, record.channel, isRetrying]);

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

  return (
    <Card className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col justify-between p-4 space-y-3 hover:border-gray-300 transition-colors">
      <div className="space-y-3">
        {/* Header Row: Channel Icon + Title/Subtitle + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 shrink-0">
              <CommunicationChannelIcon channel={record.channel} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">{groupInfo.name}</h4>
              <p className="text-xs text-gray-500 truncate">
                {t(record.channel)} • {target?.groupType === 'BENEFICIARY' ? t('BENEFICIARY') : t('STAKEHOLDER')} • {groupInfo.name}
              </p>
            </div>
          </div>
          <CommunicationStatusBadge status={effectiveTargetStatus} isLoading={isTargetResolving} />
        </div>

        {/* Voice Player or Message Preview */}
        {record.channel === 'VOICE' && audioURL?.mediaURL ? (
          <div className="bg-slate-50 p-2.5 rounded border border-gray-200 space-y-1">
            <p className="text-[11px] font-medium text-gray-600 truncate">{audioURL.fileName || 'recording.wav'}</p>
            <audio src={audioURL.mediaURL} controls className="w-full h-8 rounded" />
          </div>
        ) : messageText ? (
          <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto font-sans">
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
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-end justify-between gap-2">
        <div className="text-[11px] text-gray-500 space-y-0.5">
          <p>{t('COMPLETED_AT') || 'Completed At'}: {formatDate(target?.updatedAt || raw?.updatedAt, 'MMMM d, yyyy at h:mm:ss a')}</p>
          <p>{t('UPDATED_AT') || 'Updated at'}: {formatDate(target?.updatedAt || raw?.updatedAt, 'MMMM d, yyyy at h:mm:ss a')}</p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {(failed > 0 || target?.status === 'FAILED') && (
            <DialogComponent
              buttonIcon={RefreshCcw}
              buttonText={tg('RETRY') || 'Retry'}
              dialogTitle={t('RETRY_BROADCAST') || 'Retry Broadcast'}
              dialogDescription={t('RETRY_COMMUNICATION_CONFIRM') || 'Are you sure you want to retry this broadcast?'}
              confirmButtonText={t('CONFIRM') || 'Confirm'}
              handleClick={handleRetry}
              buttonClassName="h-8 text-xs font-medium px-3.5 gap-1.5 rounded-sm shrink-0 whitespace-nowrap"
              confirmButtonClassName="rounded-sm bg-primary"
              variant="outline"
            />
          )}

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
