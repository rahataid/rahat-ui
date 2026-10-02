'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLabelDigits, useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { Heading, Back, DataCard, SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import {
  ArrowLeft,
  RefreshCcw,
  Trash,
  SendHorizontal,
  Download,
} from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  useDeleteCommunication,
  useGetCommunication,
  useListAllTransports,
  useTriggerCommunicationBroadcast,
  useBeneficiariesGroups,
  useStakeholdersGroups,
} from '@rahat-ui/query';
import { toCommunicationRecord } from '../components/useCommunicationsTableColumns';
import { CommunicationStatusBadge } from '../components/communication-status-badge';
import { CommunicationChannelIcon } from '../components/communication-channel-icon';
import { resolveChannelByTransportId } from '../utils/communications.utils';
import { getSmsInfo } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { exportCommunicationGroups } from '../../communicationLog/details/comms.logs.export.utils';
import { UUID } from 'crypto';

export default function CommunicationDetailsView() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();
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
  const { data: beneficiaryGroupsData } = useBeneficiariesGroups(projectId as UUID, { page: 1, perPage: 100 });
  const { data: stakeholderGroupsData } = useStakeholdersGroups(projectId as UUID, { page: 1, perPage: 100 });
  const isMutating = deleteCommunication.isPending || triggerBroadcast.isPending;

  const communicationsListPath = `/projects/aa/${projectId}/communications`;

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

  const raw = (communication as any)?.data ?? communication;

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

  const record = toCommunicationRecord(
    raw,
    resolveChannelByTransportId(appTransports, raw?.transportId, raw?.audioURL),
  );
  const targets = raw?.targets ?? [];
  const audioURL = typeof raw?.audioURL === 'object' ? raw.audioURL : null;
  const smsInfo =
    record.channel === 'SMS' && typeof raw?.message === 'string' && raw.message
      ? getSmsInfo(raw.message)
      : null;

  const targetBeneficiaries = record.targetAudience?.beneficiaries || [];
  const targetStakeholders = record.targetAudience?.stakeholders || [];
  const hasFailedTargets = targets.some((target: any) => target?.status === 'FAILED');
  const hasPendingTargets = targets.some(
    (target: any) => target?.status === 'PENDING' || target?.status === 'PROCESSING',
  );

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
    const rawList = isBeneficiary
      ? (beneficiaryGroupsData as any)?.data ?? beneficiaryGroupsData ?? []
      : (stakeholderGroupsData as any)?.data ?? stakeholderGroupsData ?? [];

    const found = (rawList as any[]).find((g: any) => g?.uuid === groupId || g?.id === groupId);
    if (found) {
      const count = isBeneficiary
        ? (found._count?.beneficiaries ?? found?.groupedBeneficiaries?.length ?? found?.beneficiaries?.length ?? 0)
        : (found._count?.stakeholders ?? found?.stakeholders?.length ?? 0);
      return { name: found.name, count };
    }

    return { name: groupId || (isBeneficiary ? t('BENEFICIARY_GROUP') : t('STAKEHOLDER_GROUP')), count: 0 };
  };

  const totalAudienceReach = targets.reduce((sum: number, target: any) => {
    const info = getGroupDetails(target.groupId, target.groupType, target.group);
    return sum + (info.count || 0);
  }, 0);

  const pendingCount = targets.filter((t: any) => t?.status === 'PENDING' || t?.status === 'PROCESSING').length;

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
    if (isMutating) return;
    try {
      await triggerBroadcast.mutateAsync({
        projectUUID: projectId as UUID,
        communicationUUID: commId,
      });
      Swal.fire(t('RETRY_SUCCESSFUL'), '', 'success');
    } catch (error) {
      console.error('Retry failed:', error);
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

  const handleExportLogs = () => {
    exportCommunicationGroups(targets, getGroupDetails, record.title);
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
              description={t('DETAILED_VIEW_OF_COMMUNICATION')}
            />
            {raw?.updatedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('UPDATED_AT')}: {formatDate(raw.updatedAt, 'MMMM d, yyyy, h:mm:ss a') || raw.updatedAt}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <TooltipWrapper tip={t('DELETE_COMMUNICATION')}>
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
            </TooltipWrapper>

            <TooltipWrapper tip={tg('EXPORT_LOGS') || 'Export Logs'}>
              <Button
                variant="outline"
                className="gap-2 h-7"
                onClick={handleExportLogs}
                disabled={!targets.length}
              >
                <Download className="h-3.5 w-3.5" />
                {tg('EXPORT') || 'Export'}
              </Button>
            </TooltipWrapper>

            {hasPendingTargets && !hasFailedTargets && (
              <TooltipWrapper tip={t('SEND_BROADCAST')}>
                <DialogComponent
                  buttonIcon={SendHorizontal}
                  buttonText={t('SEND_BROADCAST')}
                  dialogTitle={t('SEND_BROADCAST')}
                  dialogDescription={t('SEND_BROADCAST_CONFIRM')}
                  confirmButtonText={t('CONFIRM')}
                  handleClick={handleSendConfirm}
                  buttonClassName="rounded-sm text-xs h-9 px-3"
                  confirmButtonClassName="rounded-sm bg-primary"
                  variant="outline"
                />
              </TooltipWrapper>
            )}

            {hasFailedTargets && (
              <TooltipWrapper tip={t('RETRY_BROADCAST')}>
                <DialogComponent
                  buttonIcon={RefreshCcw}
                  buttonText={t('RETRY_FAILED')}
                  dialogTitle={t('RETRY_BROADCAST')}
                  dialogDescription={t('RETRY_COMMUNICATION_CONFIRM')}
                  confirmButtonText={t('CONFIRM')}
                  handleClick={handleRetryConfirm}
                  buttonClassName="rounded-sm text-xs h-9 px-3"
                  confirmButtonClassName="rounded-sm bg-primary"
                  variant="outline"
                />
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Summary Grid (Left 2/3 Main Card + Right 1/3 4 Data Cards) ── */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Left Card: Communication Title & Channel/Status */}
        <div className="flex-[2]">
          <Card className="p-4 rounded-sm bg-white border border-gray-200 h-full flex flex-col justify-between shadow-none">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1.5">
                  <CommunicationChannelIcon channel={record.channel} className="h-3.5 w-3.5" />
                  {t(record.channel)}
                </span>
                <CommunicationStatusBadge status={record.status} />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">{t('COMMUNICATION_TITLE')}:</span>
                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                  {record.title}
                </h2>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section: 2x2 Data Cards Grid matching comms logs detail page */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <DataCard
            title={t('SUCCESSFULLY_DELIVERED') || 'Successfully Delivered'}
            smallNumber={formatNum(record.delivered)}
            className="rounded-sm w-full h-20 pt-10 pb-8"
          />
          <DataCard
            title={t('FAILED_DELIVERED') || 'Failed Delivered'}
            smallNumber={formatNum(record.failed || 0)}
            className="rounded-sm w-full h-20 pt-10 pb-8"
          />
          <DataCard
            title={tg('SCHEDULED') || 'Scheduled'}
            smallNumber={formatNum(0)}
            className="rounded-sm w-full h-20 pt-10 pb-8"
          />
          <DataCard
            title={tg('PENDING') || 'Pending'}
            smallNumber={formatNum(pendingCount)}
            className="rounded-sm w-full h-20 pt-10 pb-8"
          />
        </div>
      </div>

      {/* ── Bottom Split Section (Left 1/3 Details Card + Right 2/3 Audience Table) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        {/* Left Column (1/3) — Details Card */}
        <Card className="col-span-1 bg-white rounded-sm border border-gray-200 p-4 shadow-none flex flex-col justify-between">
          <div className="space-y-4 text-xs text-gray-700">
            {/* Target Audience Groups */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">{t('TARGET_AUDIENCE')}</p>
              <p className="font-semibold text-sm text-gray-900">
                {targetBeneficiaries.length > 0 && targetStakeholders.length > 0
                  ? `${t('BENEFICIARIES')} & ${t('STAKEHOLDERS')}`
                  : targetBeneficiaries.length > 0
                  ? t('BENEFICIARIES')
                  : targetStakeholders.length > 0
                  ? t('STAKEHOLDERS')
                  : t('NONE_SPECIFIED')}
              </p>
            </div>

            {/* Triggered Date */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">{t('TRIGGERED_DATE') || 'Triggered Date'}</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(raw?.createdAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.createdAt || tg('N_A')}
              </p>
            </div>

            {/* Total Audience */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">{t('TOTAL_AUDIENCE') || 'Total Audience'}</p>
              <p className="font-semibold text-gray-900 text-sm">
                {formatNum(totalAudienceReach)}
              </p>
            </div>

            {/* Started At */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">{t('STARTED_AT') || 'Started At'}</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(raw?.createdAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.createdAt || tg('N_A')}
              </p>
            </div>

            {/* Ended At */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">{t('ENDED_AT') || 'Ended At'}</p>
              <p className="font-semibold text-gray-900 text-xs">
                {formatDate(raw?.updatedAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.updatedAt || tg('N_A')}
              </p>
            </div>

            {/* Channel & Status */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1.5 border border-slate-200">
                <CommunicationChannelIcon channel={record.channel} className="h-3.5 w-3.5" />
                {t(record.channel)}
              </span>
              <CommunicationStatusBadge status={record.status} />
            </div>

            {/* Message Content or Voice Player */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {record.channel === 'VOICE' ? t('VOICE_RECORDING') : t('MESSAGE_CONTENT')}
              </p>
              {record.channel === 'VOICE' ? (
                <div className="bg-slate-50 p-2.5 rounded border border-gray-200 space-y-2">
                  <p className="text-[11px] font-medium text-gray-600 truncate">{audioURL?.fileName || 'recording.mp3'}</p>
                  {audioURL?.mediaURL ? (
                    <audio src={audioURL.mediaURL} controls className="w-full h-8 rounded" />
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t('NO_DATA_AVAILABLE')}</p>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-3 rounded border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto font-sans">
                  {record.description || <span className="text-gray-400 italic">{tg('N_A')}</span>}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Right Column (2/3) — Search Filter & Audience Table matching comms logs detail page */}
        <Card className="col-span-1 lg:col-span-2 bg-white rounded-sm border border-gray-200 p-4 space-y-4 shadow-none flex flex-col justify-between">
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-72">
                <SearchInput
                  placeholder={t('SEARCH_AUDIENCE') || 'Search Audience...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Target Audience Table matching screenshot */}
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3.5">{t('AUDIENCE') || 'Audience'}</th>
                    <th className="py-2.5 px-3.5">{t('STATUS') || 'Status'}</th>
                    <th className="py-2.5 px-3.5 text-right">{t('TIMESTAMP') || 'Timestamp'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTargets.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted-foreground italic">
                        {t('NO_AUDIENCE_FOUND') || 'No audience records found'}
                      </td>
                    </tr>
                  ) : (
                    filteredTargets.map((target: any) => {
                      const groupInfo = getGroupDetails(target?.groupId, target?.groupType, target?.group);
                      return (
                        <tr key={target.uuid} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3.5 font-medium text-gray-900">
                            <div>{groupInfo.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {formatNum(groupInfo.count)} {target?.groupType === 'BENEFICIARY' ? t('BENEFICIARIES') : t('STAKEHOLDERS')}
                            </div>
                          </td>
                          <td className="py-3 px-3.5">
                            <CommunicationStatusBadge status={target?.status} />
                          </td>
                          <td className="py-3 px-3.5 text-right text-muted-foreground">
                            {formatDate(target?.updatedAt || raw?.updatedAt, 'yyyy-MM-dd, h:mm:ss a')}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Count Bar */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('TOTAL_COUNT') || 'Total Count'}: {formatNum(filteredTargets.length)}</span>
            <span>{t('PAGE') || 'Page'} 1 {t('OF') || 'of'} 1</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
