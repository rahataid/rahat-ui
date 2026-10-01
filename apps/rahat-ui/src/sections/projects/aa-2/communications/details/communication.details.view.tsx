'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { Heading, Back, IconLabelBtn } from 'apps/rahat-ui/src/common';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  Users,
  Mic,
  RefreshCcw,
  Trash,
  SendHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useDeleteCommunication, useGetCommunication, useListAllTransports, useTriggerCommunicationBroadcast, useBeneficiariesGroups, useStakeholdersGroups } from '@rahat-ui/query';
import { toCommunicationRecord } from '../components/useCommunicationsTableColumns';
import { resolveChannelByTransportId } from '../utils/communications.utils';
import { getSmsInfo } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { UUID } from 'crypto';

export default function CommunicationDetailsView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const formatDate = useDateFormat();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const commId = params.commId as string;

  const [activeTab, setActiveTab] = useState('communications');

  const appTransports = useListAllTransports();
  const { data: communication, isLoading, isError, refetch, isFetching } = useGetCommunication(projectId as UUID, commId);
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
  const smsInfo = record.channel === 'SMS' && typeof raw?.message === 'string' && raw.message
    ? getSmsInfo(raw.message)
    : null;

  const getIcon = () => {
    switch (record.channel) {
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      case 'EMAIL':
        return <Mail className="h-5 w-5 text-gray-500" />;
      case 'VOICE':
        return <Mic className="h-5 w-5 text-gray-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="bg-green-100 text-green-700 text-xs font-normal px-2.5 py-0.5 rounded-sm">
            {t('DELIVERED')}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-blue-100 text-blue-700 text-xs font-normal px-2.5 py-0.5 rounded-sm">
            {t('IN_PROGRESS')}
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="bg-red-100 text-red-700 text-xs font-normal px-2.5 py-0.5 rounded-sm">
            {t('FAILED')}
          </span>
        );
    }
  };

  const percent = record.recipients > 0 ? Math.round((record.delivered / record.recipients) * 100) : 0;
  const targetBeneficiaries = record.targetAudience?.beneficiaries || [];
  const targetStakeholders = record.targetAudience?.stakeholders || [];
  const totalGroups = targetBeneficiaries.length + targetStakeholders.length;
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

  const handleSendConfirm = () => {
    if (isMutating) return;
    triggerBroadcast.mutate({
      projectUUID: projectId as UUID,
      communicationUUID: commId,
    });
  };

  const handleRetryConfirm = () => {
    if (isMutating) return;
    triggerBroadcast.mutate({
      projectUUID: projectId as UUID,
      communicationUUID: commId,
    });
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
    <div className="h-[calc(100vh-65px)] p-4">
      {/* ── Top Header and Action Buttons ── */}
      <div className="flex gap-2 justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Back path={communicationsListPath} />
          <Heading
            title={record.title}
            description={t('COMMUNICATION_DETAILS_DESC')}
            titleStyle="text-xl sm:text-4xl"
          />
        </div>

        <div className="flex flex-col gap-2 lg:flex-row items-center justify-center">
          <div className="flex space-x-2">
            <TooltipWrapper tip={t('DELETE_COMMUNICATION')}>
              <DialogComponent
                buttonIcon={Trash}
                buttonText={t('DELETE')}
                dialogTitle={t('DELETE_COMMUNICATION')}
                dialogDescription={t('DELETE_COMMUNICATION_CONFIRM')}
                confirmButtonText={t('CONFIRM')}
                handleClick={handleDeleteConfirm}
                buttonClassName="rounded-sm w-full text-red-500 border-red-500 sm"
                confirmButtonClassName="rounded-sm w-full bg-red-500"
                variant="outline"
              />
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
                  buttonClassName="rounded-sm w-full"
                  confirmButtonClassName="rounded-sm w-full bg-primary"
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
                  buttonClassName="rounded-sm w-full"
                  confirmButtonClassName="rounded-sm w-full bg-primary"
                  variant="outline"
                />
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Grid Layout matching activities/beneficiary ── */}
      <div className="grid lg:grid-cols-2 gap-3 w-full">
        {/* ── Left Column: Communication Cards & Details ── */}
        <div className="flex flex-col gap-3 w-full">
          {/* Main Info Card */}
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TooltipWrapper tip={`${t('CHANNEL')}: ${t(record.channel)}`}>
                <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer flex items-center gap-1.5">
                  {getIcon()}
                  {t(record.channel)}
                </span>
              </TooltipWrapper>

              <TooltipWrapper tip={`${t('TARGET_AUDIENCE')}: ${formatDigits(totalGroups)} ${t('GROUPS_SELECTED')}`}>
                <span className="bg-green-100 text-green-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                  {targetBeneficiaries.length > 0 && targetStakeholders.length > 0
                    ? `${t('BENEFICIARIES')} & ${t('STAKEHOLDERS')}`
                    : targetBeneficiaries.length > 0
                      ? t('BENEFICIARIES')
                      : t('STAKEHOLDERS')}
                </span>
              </TooltipWrapper>

              {smsInfo && (
                <TooltipWrapper tip={`${t('SMS_CREDIT')}: ${formatDigits(smsInfo.smsCredits)}`}>
                  <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                    {formatDigits(smsInfo.smsCredits)} {t(smsInfo.smsCredits === 1 ? 'SMS_CREDIT' : 'SMS_CREDITS')}
                  </span>
                </TooltipWrapper>
              )}

              <div className="ml-auto">
                <TooltipWrapper tip={`${t('STATUS')}: ${t(record.status)}`}>
                  {getStatusBadge(record.status)}
                </TooltipWrapper>
              </div>
            </div>

            <TooltipWrapper tip={`${t('COMMUNICATION_TITLE')}: ${record.title}`}>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate max-w-full cursor-pointer mb-2">
                {record.title}
              </h3>
            </TooltipWrapper>

            {/* Message Body or Audio Recording */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {record.channel === 'VOICE' ? t('VOICE_RECORDING') : t('MESSAGE_CONTENT')}
              </p>
              {record.channel === 'VOICE' ? (
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-medium">{audioURL?.fileName ?? t('VOICE_RECORDING')}</span>
                  </div>
                  {audioURL?.mediaURL ? (
                    <audio
                      src={audioURL.mediaURL}
                      controls
                      className="w-full h-8 rounded"
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t('NO_DATA_AVAILABLE')}</p>
                  )}
                  {!!record.description && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                        {t('TRANSCRIPT')}
                      </p>
                      <p className="text-xs text-gray-700 italic leading-relaxed">
                        "{record.description}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {record.description}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1">
              <div>
                <span className="font-medium text-gray-700">{t('STARTED_AT')}: </span>
                {formatDate(raw?.createdAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.createdAt}
              </div>
              <div>
                <span className="font-medium text-gray-700">{t('COMPLETED_AT')}: </span>
                {formatDate(raw?.updatedAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.updatedAt}
              </div>
            </div>
          </div>

          {/* Delivery Performance Metrics Card */}
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 w-full">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">{t('DELIVERY_METRICS')}</h4>
              <span className="text-xs text-gray-500">{t(record.channel)}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-500 font-medium">{t('DELIVERY_RATE')}</span>
                <span className="text-xl font-bold text-gray-900">{formatDigits(percent)}%</span>
              </div>
              <Progress value={percent} className="h-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100">
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[11px] text-gray-500 mb-0.5">{t('TOTAL_GROUPS') || 'Total Groups'}</p>
                <p className="text-sm font-bold text-gray-900">{formatDigits(record.recipients)}</p>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-[11px] text-blue-700 mb-0.5">{t('TOTAL_AUDIENCE_REACH') || 'Audience Reach'}</p>
                <p className="text-sm font-bold text-blue-700">{formatDigits(totalAudienceReach)}</p>
              </div>
              <div className="p-2.5 bg-green-50 rounded-lg border border-green-100">
                <p className="text-[11px] text-green-700 mb-0.5">{t('SUCCESSFUL')}</p>
                <p className="text-sm font-bold text-green-700">{formatDigits(record.delivered)}</p>
              </div>
              <div className="p-2.5 bg-red-50 rounded-lg border border-red-100">
                <p className="text-[11px] text-red-600 mb-0.5">{t('FAILED')}</p>
                <p className="text-sm font-bold text-red-600">{formatDigits(record.failed || 0)}</p>
              </div>
            </div>
          </div>

          {/* Selected Target Audience Card (placed after Delivery Metrics) */}
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 w-full space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-gray-900">{t('TARGET_AUDIENCE')}</h4>
              </div>
              {totalGroups > 0 && (
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {formatDigits(totalGroups)} {t('GROUPS_SELECTED')}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
              {targetBeneficiaries.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      {t('BENEFICIARIES')} ({formatDigits(targetBeneficiaries.length)})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {targets
                      .filter((target: any) => target?.groupType === 'BENEFICIARY')
                      .map((target: any) => {
                        const info = getGroupDetails(target.groupId, 'BENEFICIARY', target.group);
                        const isEmpty = info.count === 0;
                        return (
                          <Badge
                            key={target.uuid || target.groupId}
                            variant="secondary"
                            className="text-xs font-medium px-2.5 py-1 max-w-[280px] truncate cursor-default bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 rounded-md flex items-center gap-1.5"
                          >
                            <span>{info.name}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${isEmpty
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-slate-200 text-slate-800'
                                }`}
                            >
                              {formatDigits(info.count)}
                            </span>
                          </Badge>
                        );
                      })}
                  </div>
                </div>
              )}

              {targetStakeholders.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      {t('STAKEHOLDERS')} ({formatDigits(targetStakeholders.length)})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {targets
                      .filter((target: any) => target?.groupType === 'STAKEHOLDERS' || target?.groupType === 'STAKEHOLDER')
                      .map((target: any) => {
                        const info = getGroupDetails(target.groupId, target.groupType, target.group);
                        const isEmpty = info.count === 0;
                        return (
                          <Badge
                            key={target.uuid || target.groupId}
                            variant="outline"
                            className="text-xs font-medium px-2.5 py-1 max-w-[280px] truncate cursor-default bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-md flex items-center gap-1.5"
                          >
                            <span>{info.name}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${isEmpty
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {formatDigits(info.count)}
                            </span>
                          </Badge>
                        );
                      })}
                  </div>
                </div>
              )}

              {targetBeneficiaries.length === 0 && targetStakeholders.length === 0 && (
                <div className="py-3 text-center text-xs text-muted-foreground italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  {t('NONE_SPECIFIED')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Communications & History List matching activity.communication.list.card ── */}
        <div className="border px-4 pt-2 rounded-xl bg-white shadow-sm w-full">
          <div className="mb-4 flex items-center justify-between">
            <div className="w-full flex flex-row self-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('COMMUNICATION_LIST')}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('LIST_OF_COMMUNICATIONS_IN_THIS_ACTIVITY')}
                </p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 rounded-sm">
              <TabsTrigger
                value="communications"
                className="data-[state=active]:bg-white flex items-center gap-2"
              >
                {t('COMMUNICATIONS')}
                <Badge
                  className={`h-5 w-5 justify-center text-white px-2 py-0 ${activeTab === 'communications' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                >
                  {formatDigits(1)}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-white flex items-center gap-2"
              >
                {t('HISTORY')}
                <Badge
                  className={`h-5 w-5 justify-center text-white px-2 py-0 ${activeTab === 'history' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                >
                  {formatDigits(targets.length)}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Communications Tab Content */}
            <TabsContent value="communications" className="mt-3">
              <div className="overflow-y-auto scrollbar-hidden xl:h-[calc(100vh-320px)] h-[calc(100vh-200px)] space-y-3">
                <Card className="rounded-sm border border-gray-200">
                  <CardContent className="pt-4 px-4 pb-4">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                        {getIcon()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <TooltipWrapper tip={`${t('COMMUNICATION_TITLE')}: ${record.title}`}>
                            <h3 className="font-medium text-gray-900 truncate w-[320px]">
                              {record.title}
                            </h3>
                          </TooltipWrapper>

                          <div className="ml-auto flex items-center gap-2">
                            <TooltipWrapper tip={`${t('STATUS')}: ${t(record.status)}`}>
                              {getStatusBadge(record.status)}
                            </TooltipWrapper>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 flex-wrap">
                          <span>{t(record.channel)}</span>
                          <span>•</span>
                          <span>
                            {totalGroups === 0
                              ? t('NONE_SPECIFIED')
                              : targetBeneficiaries.length > 0
                                ? `${t('BENEFICIARIES')}`
                                : `${t('STAKEHOLDERS')}`}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDigits(totalGroups)} {t('GROUPS_SELECTED')}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDigits(totalAudienceReach)} {t('INDIVIDUALS') || 'Recipients'}
                          </span>
                          {smsInfo && (
                            <>
                              <span>•</span>
                              <span>
                                {formatDigits(smsInfo.smsCredits)} {t(smsInfo.smsCredits === 1 ? 'SMS_CREDIT' : 'SMS_CREDITS')}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-gray-900 mb-1">{record.title}</p>
                        {!!record.description && (
                          <p className="text-xs text-gray-600 mb-3">{record.description}</p>
                        )}

                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 space-y-0.5">
                          <p>
                            <span className="font-medium">{t('STARTED_AT')}: </span>
                            {formatDate(raw?.createdAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.createdAt}
                          </p>
                          <p>
                            <span className="font-medium">{t('COMPLETED_AT')}: </span>
                            {formatDate(raw?.updatedAt, 'MMMM d, yyyy, h:mm:ss a') || raw?.updatedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab Content */}
            <TabsContent value="history" className="mt-3">
              <div className="overflow-y-auto scrollbar-hidden xl:h-[calc(100vh-320px)] h-[calc(100vh-200px)] space-y-3">
                {targets.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    {t('NO_DATA_AVAILABLE')}
                  </p>
                )}
                {targets.map((target: any) => {
                  const groupInfo = getGroupDetails(target?.groupId, target?.groupType, target?.group);
                  const isEmpty = groupInfo.count === 0;
                  return (
                    <Card key={target.uuid} className="rounded-sm border border-gray-200">
                      <CardContent className="pt-4 px-4 pb-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                            {getIcon()}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 truncate max-w-[280px]">
                                {groupInfo.name}
                              </h3>
                              <span
                                className={`text-xs font-normal px-2 py-0.5 rounded-sm ${isEmpty
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-gray-100 text-gray-600'
                                  }`}
                              >
                                {formatDigits(groupInfo.count)} {target?.groupType === 'BENEFICIARY' ? t('BENEFICIARIES') : t('STAKEHOLDERS')}
                                {isEmpty && ' (0 Recipients)'}
                              </span>
                              <div className="ml-auto flex items-center gap-2">
                                {getStatusBadge(
                                  target?.status === 'SENT' ? 'DELIVERED' : target?.status === 'FAILED' ? 'FAILED' : 'IN_PROGRESS',
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 flex-wrap">
                              <span>{t(record.channel)}</span>
                              <span>•</span>
                              <span>{target?.groupType === 'BENEFICIARY' ? t('BENEFICIARIES') : t('STAKEHOLDERS')}</span>
                            </div>

                            {!!target?.error && (
                              <p className="text-xs text-red-600 mb-3 break-words">{target.error}</p>
                            )}

                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 space-y-0.5">
                              {!!target?.sessionId && (
                                <p>
                                  <span className="font-medium">Session: </span>
                                  {target.sessionId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
