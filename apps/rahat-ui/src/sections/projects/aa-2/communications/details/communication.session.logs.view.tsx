'use client';

import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Heading, Back, SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import { Card, CardTitle } from '@rahat-ui/shadcn/src/components/ui/card';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  TriangleAlertIcon,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mic,
  Mail,
} from 'lucide-react';
import {
  useListSessionLogs,
  useSessionBroadCastCount,
  useSessionRetryFailed,
  useGetCommunication,
  useListAllTransports,
} from '@rahat-ui/query';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import {
  resolveChannelByTransportId,
  resolveTargetEffectiveStatus,
  resolveBroadcastLogStatus,
  resolveCommunicationLifecycleStatus,
} from '../utils/communications.utils';
import { CommunicationChannelIcon } from '../components/communication-channel-icon';
import { UUID } from 'crypto';
import { CommunicationStatusBadge } from '../components/communication-status-badge';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export function CommunicationSessionLogsView() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const formatPhone = usePhoneFormat();

  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const commId = params.commId as string;
  const sessionId = params.sessionId as string;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const debouncedSearch = useDebounce(searchTerm, 400);

  const backPath = `/projects/aa/${projectId}/communications/${commId}`;

  const { data: communication, isLoading: isLoadingComm } = useGetCommunication(projectId as UUID, commId);
  const rawComm = (communication as any)?.data ?? communication;

  const appTransports = useListAllTransports();
  const channel = resolveChannelByTransportId(appTransports, rawComm?.transportId, rawComm?.audioURL);

  const targetGroup = useMemo(() => {
    if (!Array.isArray(rawComm?.targets)) return null;
    return rawComm.targets.find((t: any) => t.sessionId === sessionId) ?? null;
  }, [rawComm, sessionId]);

  const { data: sessionLogsData, isLoading: isLoadingLogs, refetch } = useListSessionLogs(
    sessionId,
    {
      page,
      perPage,
      address: debouncedSearch || undefined,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    },
  );

  const { data: broadcastCounts, isLoading: isBroadcastLoading } = useSessionBroadCastCount(sessionId ? [sessionId] : []);
  const isBroadcastResolving = !!sessionId && (isBroadcastLoading || broadcastCounts === undefined);
  const mutateRetry = useSessionRetryFailed();

  const counts = broadcastCounts?.data ?? {
    SUCCESS: 0,
    FAIL: 0,
    PENDING: 0,
    SCHEDULED: 0,
    TOTAL: 0,
  };

  const effectiveStatus = useMemo(() => {
    return resolveCommunicationLifecycleStatus({
      channel,
      rawStatus: targetGroup?.status,
      counts,
      hasActiveTargets: targetGroup?.status === 'SENT' || targetGroup?.status === 'PROCESSING',
      hasPendingTargets: targetGroup?.status === 'PENDING',
      hasSession: !!sessionId,
      isRetrying: mutateRetry.isPending,
    });
  }, [channel, targetGroup?.status, counts, sessionId, mutateRetry.isPending]);

  const logsList = sessionLogsData?.httpReponse?.data?.data ?? [];
  const meta = sessionLogsData?.httpReponse?.data?.meta ?? { total: 0, lastPage: 1 };

  const handleRetry = async () => {
    if (!sessionId || mutateRetry.isPending) return;
    try {
      await mutateRetry.mutateAsync({ cuid: sessionId, includeFailed: true });
      refetch();
    } catch (error) {
      console.error('Retry error:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
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
              {t('UPDATED_AT')}: {formatDate(targetGroup?.updatedAt || rawComm?.updatedAt, 'MMMM d, yyyy, h:mm:ss a')}
            </p>

            <div className="flex gap-2 items-center">
              {counts.FAIL > 0 && (
                <DialogComponent
                  buttonIcon={RefreshCcw}
                  buttonText={t('RETRY_FAILED_REQUESTS') || 'Retry Failed'}
                  dialogTitle={t('RETRY_BROADCAST') || 'Retry Broadcast'}
                  dialogDescription={t('RETRY_COMMUNICATION_CONFIRM') || 'Are you sure you want to retry this broadcast?'}
                  confirmButtonText={t('CONFIRM') || 'Confirm'}
                  handleClick={handleRetry}
                  buttonClassName="gap-1.5 h-8 px-3.5 text-xs bg-primary text-white hover:bg-primary/90 shrink-0 whitespace-nowrap"
                  confirmButtonClassName="rounded-sm bg-primary"
                  variant="default"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full mt-2">
          <div className="flex-[2]">
            <Card className="p-4 rounded-sm bg-white border border-gray-200 h-full flex flex-col justify-between shadow-none space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1.5">
                    <CommunicationChannelIcon channel={channel} className="h-3.5 w-3.5" />
                    {t(channel)}
                  </span>
                  <CommunicationStatusBadge status={effectiveStatus} isLoading={isBroadcastResolving} />
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">{t('COMMUNICATION_TITLE')}:</span>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">
                    {rawComm?.title || t('COMMUNICATION')}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t(channel)} 
                    {targetGroup?.groupType ? ` • ${targetGroup.groupType === 'BENEFICIARY' ? t('BENEFICIARY') : t('STAKEHOLDER')}` : ''} 
                    {targetGroup?.group?.name || targetGroup?.groupId ? ` • ${targetGroup.group?.name || targetGroup.groupId}` : ''}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {channel === 'VOICE' ? t('VOICE_RECORDING') : t('MESSAGE_CONTENT')}
                </p>
                {channel === 'VOICE' && rawComm?.audioURL?.mediaURL ? (
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 space-y-1.5">
                    <p className="text-[11px] font-medium text-gray-600 truncate">{rawComm.audioURL.fileName || 'recording.mp3'}</p>
                    <audio src={rawComm.audioURL.mediaURL} controls className="w-full h-8 rounded" />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2.5 rounded border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto font-sans">
                    {typeof rawComm?.message === 'string' ? rawComm.message : rawComm?.subject || <span className="text-gray-400 italic">{tg('N_A')}</span>}
                  </div>
                )}
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-gray-100">
                <span>{t('STARTED_AT')}: {formatDate(targetGroup?.createdAt || rawComm?.createdAt, 'MMMM d, yyyy, h:mm:ss a')}</span>
                <span>{t('ENDED_AT')}: {formatDate(targetGroup?.updatedAt || rawComm?.updatedAt, 'MMMM d, yyyy, h:mm:ss a')}</span>
              </div>
            </Card>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
              <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-2 leading-snug">
                {t('SUCCESSFULLY_DELIVERED') || 'Successfully Delivered'}
              </h1>
              {isBroadcastResolving ? (
                <Skeleton className="h-7 w-16 mt-2" />
              ) : (
                <p className="text-primary font-semibold text-2xl mt-2">{formatNum(counts.SUCCESS)}</p>
              )}
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
              <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-2 leading-snug">
                {t('FAILED_DELIVERED') || 'Failed Delivered'}
              </h1>
              {isBroadcastResolving ? (
                <Skeleton className="h-7 w-16 mt-2" />
              ) : (
                <p className="text-primary font-semibold text-2xl mt-2">{formatNum(counts.FAIL)}</p>
              )}
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
              <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-2 leading-snug">
                {tg('SCHEDULED') || 'Scheduled'}
              </h1>
              {isBroadcastResolving ? (
                <Skeleton className="h-7 w-16 mt-2" />
              ) : (
                <p className="text-primary font-semibold text-2xl mt-2">{formatNum(counts.SCHEDULED)}</p>
              )}
            </div>
            <div className="bg-white rounded-sm border border-gray-200 p-3.5 flex flex-col justify-between shadow-sm">
              <h1 className="font-medium text-[13px] text-muted-foreground line-clamp-2 leading-snug">
                {tg('PENDING') || 'Pending'}
              </h1>
              {isBroadcastResolving ? (
                <Skeleton className="h-7 w-16 mt-2" />
              ) : (
                <p className="text-primary font-semibold text-2xl mt-2">{formatNum(counts.PENDING)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-white rounded-sm border border-gray-200 p-4 space-y-4 shadow-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <SearchInput
              name="search-member-logs-page"
              placeholder={t('SEARCH') || 'Search...'}
              value={searchTerm}
              onSearch={(e: any) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-48">
            <SelectComponent
              options={[
                { label: t('ALL_STATUSES') || 'All Statuses', value: 'ALL' },
                { label: t('SUCCESS') || 'Success', value: 'SUCCESS' },
                { label: t('PENDING') || 'Pending', value: 'PENDING' },
                { label: t('FAILED') || 'Failed', value: 'FAIL' },
              ]}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-600 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3.5">{t('RECIPIENT') || 'Recipient'}</th>
                <th className="py-2.5 px-3.5">{t('STATUS') || 'Status'}</th>
                <th className="py-2.5 px-3.5 text-center">{t('ATTEMPTS') || 'Attempts'}</th>
                <th className="py-2.5 px-3.5 text-center">{t('DURATION') || 'Duration'}</th>
                <th className="py-2.5 px-3.5 text-right">{t('TIMESTAMP') || 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingLogs ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    {t('LOADING') || 'Loading member logs...'}
                  </td>
                </tr>
              ) : logsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground italic">
                    {t('NO_LOGS_FOUND') || 'No member broadcast logs found.'}
                  </td>
                </tr>
              ) : (
                logsList.map((row: any, idx: number) => {
                  const { displayStatus, isFail, failReason, durationSec } = resolveBroadcastLogStatus(row, channel, t);

                  return (
                    <tr key={row.uuid || row.cuid || idx} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3.5 font-medium text-gray-900">
                        {formatPhone(row?.address) || row?.address || tg('N_A')}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <CommunicationStatusBadge status={displayStatus} />
                          {isFail && failReason && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <TriangleAlertIcon className="w-4 h-4 text-rose-500 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-xs p-2 bg-gray-900 text-white">
                                  <p className="font-semibold">{t('FAIL_REASON') || 'Failure Reason'}:</p>
                                  <p className="break-words">{failReason}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center font-medium">
                        {formatNum(row?.attempts ?? 1)}
                      </td>
                      <td className="py-3 px-3.5 text-center text-muted-foreground">
                        {durationSec != null ? `${formatNum(durationSec)}${t('SECONDS_SHORT')}` : tg('N_A')}
                      </td>
                      <td className="py-3 px-3.5 text-right text-muted-foreground">
                        {formatDate(row?.updatedAt || row?.createdAt, 'yyyy-MM-dd, h:mm:ss a')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('TOTAL_COUNT') || 'Total Count'}: {formatNum(meta?.total ?? logsList.length)}</span>
          <div className="flex items-center gap-2">
            <span>
              {t('PAGE') || 'Page'} {page} {t('OF') || 'of'} {meta?.lastPage || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(meta?.lastPage || 1, p + 1))}
              disabled={page >= (meta?.lastPage || 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
