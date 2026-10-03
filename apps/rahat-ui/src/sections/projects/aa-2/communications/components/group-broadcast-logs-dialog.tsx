'use client';

import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { DialogComponent } from '../../activities/details/dialog.reuse';
import { TriangleAlertIcon, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useListSessionLogs,
  useSessionBroadCastCount,
  useSessionRetryFailed,
} from '@rahat-ui/query';
import { SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { CommunicationChannelIcon } from './communication-channel-icon';
import { CommunicationStatusBadge } from './communication-status-badge';
import { resolveTargetEffectiveStatus, resolveBroadcastLogStatus } from '../utils/communications.utils';

type GroupBroadcastLogsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  target: {
    uuid: string;
    groupId: string;
    groupType: string;
    status?: string;
    sessionId?: string | null;
  } | null;
  groupName: string;
  channel: 'SMS' | 'VOICE' | 'EMAIL';
};

export function GroupBroadcastLogsDialog({
  isOpen,
  onClose,
  target,
  groupName,
  channel,
}: GroupBroadcastLogsDialogProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const formatPhone = usePhoneFormat();

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const debouncedSearch = useDebounce(searchTerm, 400);

  const sessionId = target?.sessionId ?? '';

  const { data: sessionLogsData, isLoading, isError, refetch } = useListSessionLogs(
    sessionId,
    {
      page,
      perPage,
      address: debouncedSearch || undefined,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    },
  );

  const { data: broadcastCounts } = useSessionBroadCastCount(sessionId ? [sessionId] : []);
  const mutateRetry = useSessionRetryFailed();

  const counts = broadcastCounts?.data ?? {
    SUCCESS: 0,
    FAIL: 0,
    PENDING: 0,
    SCHEDULED: 0,
    TOTAL: 0,
  };

  const effectiveStatus = useMemo(() => {
    return resolveTargetEffectiveStatus(target?.status, counts);
  }, [target?.status, counts]);

  const logsList = sessionLogsData?.httpReponse?.data?.data ?? [];
  const meta = sessionLogsData?.httpReponse?.data?.meta ?? { total: 0, lastPage: 1 };

  const handleRetry = async () => {
    if (!sessionId || mutateRetry.isPending) return;
    try {
      await mutateRetry.mutateAsync({ cuid: sessionId, includeFailed: true });
      Swal.fire(t('RETRY_SUCCESSFUL') || 'Retry broadcast triggered successfully', '', 'success');
      refetch();
    } catch (error) {
      console.error('Retry error:', error);
      Swal.fire(t('RETRY_FAILED') || 'Retry failed', '', 'error');
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-md">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CommunicationChannelIcon channel={channel} className="h-5 w-5 text-primary" />
                {groupName || t('TARGET_GROUP')} — {t('MEMBER_LOGS') || 'Member Broadcast Logs'}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {target?.groupType === 'BENEFICIARY' ? t('BENEFICIARY_GROUP') : t('STAKEHOLDER_GROUP')} • Session ID: {sessionId || 'N/A'}
                </span>
                <CommunicationStatusBadge status={effectiveStatus} />
              </div>
            </div>
            {counts.FAIL > 0 && (
              <TooltipWrapper tip={t('RETRY_FAILED') || 'Retry Failed'}>
                <DialogComponent
                  buttonIcon={RefreshCcw}
                  buttonText={t('RETRY_FAILED') || 'Retry Failed'}
                  dialogTitle={t('RETRY_BROADCAST') || 'Retry Broadcast'}
                  dialogDescription={t('RETRY_COMMUNICATION_CONFIRM') || 'Are you sure you want to retry this broadcast?'}
                  confirmButtonText={t('CONFIRM') || 'Confirm'}
                  handleClick={handleRetry}
                  buttonClassName="h-8 gap-1.5 text-xs border-red-300 text-red-600 hover:bg-red-50"
                  confirmButtonClassName="rounded-sm bg-primary"
                  variant="outline"
                />
              </TooltipWrapper>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {/* 4 Mini Summary Stats Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-center">
              <span className="text-[11px] font-medium text-muted-foreground uppercase">{t('SUCCESSFULLY_DELIVERED') || 'Delivered'}</span>
              <p className="text-xl font-semibold text-emerald-600 mt-0.5">{formatNum(counts.SUCCESS)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-center">
              <span className="text-[11px] font-medium text-muted-foreground uppercase">{t('FAILED_DELIVERED') || 'Failed'}</span>
              <p className="text-xl font-semibold text-red-600 mt-0.5">{formatNum(counts.FAIL)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-center">
              <span className="text-[11px] font-medium text-muted-foreground uppercase">{tg('PENDING') || 'Pending'}</span>
              <p className="text-xl font-semibold text-amber-600 mt-0.5">{formatNum(counts.PENDING)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-center">
              <span className="text-[11px] font-medium text-muted-foreground uppercase">{t('TOTAL_BROADCASTS') || 'Total'}</span>
              <p className="text-xl font-semibold text-primary mt-0.5">{formatNum(counts.TOTAL)}</p>
            </div>
          </div>

          {/* Search & Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="w-full sm:w-72">
              <SearchInput
                name="search-member-logs"
                placeholder={t('SEARCH_AUDIENCE') || 'Search Phone/Recipient...'}
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

          {/* Broadcast Logs Table */}
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
                {!sessionId ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground italic">
                      {t('NO_SESSION_CREATED') || 'No session created for this group yet.'}
                    </td>
                  </tr>
                ) : isLoading ? (
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
                    const { displayStatus, isFail, failReason, durationSec } = resolveBroadcastLogStatus(row, channel);

                    return (
                      <tr key={row.uuid || row.cuid || idx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3.5 font-medium text-gray-900">
                          {formatPhone(row?.address) || row?.address || tg('N_A')}
                        </td>
                        <td className="py-2.5 px-3.5">
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
                        <td className="py-2.5 px-3.5 text-center font-medium">
                          {formatNum(row?.attempts ?? 1)}
                        </td>
                        <td className="py-2.5 px-3.5 text-center text-muted-foreground">
                          {durationSec != null ? `${formatNum(durationSec)}s` : tg('N_A')}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-muted-foreground">
                          {formatDate(row?.updatedAt || row?.createdAt, 'yyyy-MM-dd, h:mm:ss a')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Pagination */}
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
      </DialogContent>
    </Dialog>
  );
}
