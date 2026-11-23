'use client';

import { useParams, useRouter } from 'next/navigation';

import React, { useContext, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits, translateValue } from 'apps/rahat-ui/src/utils/i18n';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye, SendHorizontal } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { CommunicationTooltip } from './communication-tooltip';
import {
  aggregateTargetStatus,
  resolveCommunicationLifecycleStatus,
} from '../utils/communications.utils';
import {
  useTriggerCommunicationBroadcast,
  useBeneficiariesGroups,
  useStakeholdersGroups,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { CommunicationStatusBadge } from './communication-status-badge';
import { CommunicationChannelIcon } from './communication-channel-icon';
import { BroadcastCountsContext } from './communications.table';
import { SendCommunicationConfirmDialog } from './send-communication-confirm-dialog';

export type CommunicationRecord = {
  id: string;
  title: string;
  description: string;
  channel: 'SMS' | 'VOICE' | 'EMAIL';
  targetAudience: {
    beneficiaries: string[];
    stakeholders: string[];
  };
  recipients: number;
  delivered: number;
  failed?: number;
  sender?: string;
  status: 'DELIVERED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING' | 'COMPLETED' | 'SENT' | string;
  date: string;
  isScheduled?: boolean;
  scheduledAt?: string | null;
  targets?: {
    uuid: string;
    groupId: string;
    groupType: string;
    status?: string;
    sessionId?: string | null;
  }[];
};

export type BackendCommunication = {
  uuid: string;
  title: string;
  message?: string | null;
  subject?: string | null;
  audioURL?: { mediaURL?: string; fileName?: string } | null;
  transportId?: string | null;
  createdBy?: string | null;
  isScheduled?: boolean;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  targets?: {
    uuid: string;
    groupId: string;
    groupType: string;
    status?: string;
    sessionId?: string | null;
  }[];
};

export const toCommunicationRecord = (
  item: BackendCommunication,
  channel: CommunicationRecord['channel'],
): CommunicationRecord => {
  const targets = Array.isArray(item?.targets) ? item.targets : [];
  const beneficiaries = targets
    .filter((target) => target?.groupType === 'BENEFICIARY')
    .map((target) => target.groupId);
  const stakeholders = targets
    .filter((target) => target?.groupType === 'STAKEHOLDERS' || target?.groupType === 'STAKEHOLDER')
    .map((target) => target.groupId);

  let targetDelivered = 0;
  let targetFailed = 0;
  let hasAnyTargetCounts = false;

  for (const t of targets as any[]) {
    if (t?.counts) {
      hasAnyTargetCounts = true;
      targetDelivered += Number(t.counts.SUCCESS ?? 0);
      targetFailed += Number(t.counts.FAIL ?? 0);
    }
  }

  const delivered = hasAnyTargetCounts
    ? targetDelivered
    : targets.filter(
        (target) =>
          target?.status === 'DELIVERED' ||
          target?.status === 'SUCCESS' ||
          target?.status === 'COMPLETED',
      ).length;
  const failed = hasAnyTargetCounts
    ? targetFailed
    : targets.filter(
        (target) => target?.status === 'FAILED' || target?.status === 'FAIL',
      ).length;
  const message =
    typeof item?.message === 'string'
      ? item.message
      : item?.subject ?? '';

  const audienceSum = targets.reduce((acc: number, t: any) => {
    const directCount =
      t?.group?.count ??
      t?.group?._count?.beneficiaries ??
      t?.group?._count?.stakeholders ??
      t?.group?.beneficiaries?.length ??
      t?.group?.stakeholders?.length ??
      t?.counts?.TOTAL ??
      t?.count;
    return directCount != null && directCount > 0 ? acc + directCount : acc;
  }, 0);

  const isFutureScheduled = Boolean(
    item?.isScheduled &&
      item?.scheduledAt &&
      new Date(item.scheduledAt).getTime() > Date.now(),
  );

  return {
    id: item.uuid,
    title: item.title,
    description: message,
    channel,
    targetAudience: { beneficiaries, stakeholders },
    recipients: audienceSum > 0 ? audienceSum : targets.length,
    delivered,
    failed,
    sender: item.createdBy ?? undefined,
    status: isFutureScheduled && !targets.some((t) => t.sessionId)
      ? 'SCHEDULED'
      : aggregateTargetStatus(targets),
    date: item.createdAt,
    isScheduled: item?.isScheduled,
    scheduledAt: item?.scheduledAt,
    targets,
  };
};

export function CommunicationRowStatusCell({
  record,
}: {
  record: CommunicationRecord;
}) {
  const countsMap = useContext(BroadcastCountsContext);
  const entry = countsMap.get(record.id);

  const sessionIds = useMemo(() => {
    return (record.targets ?? [])
      .map((t) => t.sessionId)
      .filter(Boolean) as string[];
  }, [record.targets]);

  const targetCounts = useMemo(() => {
    let aggregated: any = null;
    for (const t of (record.targets ?? []) as any[]) {
      if (t?.counts) {
        if (!aggregated) {
          aggregated = {
            SUCCESS: 0,
            FAIL: 0,
            PENDING: 0,
            SCHEDULED: 0,
            TOTAL: 0,
          };
        }
        aggregated.SUCCESS += Number(t.counts.SUCCESS ?? 0);
        aggregated.FAIL += Number(t.counts.FAIL ?? 0);
        aggregated.PENDING += Number(t.counts.PENDING ?? 0);
        aggregated.SCHEDULED += Number(t.counts.SCHEDULED ?? 0);
        aggregated.TOTAL += Number(t.counts.TOTAL ?? 0);
      }
    }
    return aggregated;
  }, [record.targets]);

  const effStatus = useMemo(() => {
    return resolveCommunicationLifecycleStatus({
      channel: record.channel || 'SMS',
      rawStatus: record.status,
      counts: targetCounts ?? entry?.data ?? undefined,
      hasActiveTargets: (record.targets ?? []).some(
        (t) => t.status === 'SENT' || t.status === 'PROCESSING',
      ),
      hasPendingTargets: (record.targets ?? []).some(
        (t) => t.status === 'PENDING',
      ),
      hasSession: sessionIds.length > 0,
      isScheduled: record.isScheduled,
      scheduledAt: record.scheduledAt,
    });
  }, [
    record.channel,
    record.status,
    targetCounts,
    entry?.data,
    record.targets,
    sessionIds.length,
    record.isScheduled,
    record.scheduledAt,
  ]);

  return <CommunicationStatusBadge status={effStatus} isLoading={false} />;
}

export function CommunicationRowDeliveryStatusCell({
  record,
  groupCountMap,
}: {
  record: CommunicationRecord;
  groupCountMap?: Map<string, number>;
}) {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const countsMap = useContext(BroadcastCountsContext);
  const entry = countsMap.get(record.id);

  const totalAudience = useMemo(() => {
    return (record.targets ?? []).reduce((acc: number, t: any) => {
      const directCount =
        t?.group?.count ??
        t?.group?._count?.beneficiaries ??
        t?.group?._count?.stakeholders ??
        t?.group?.beneficiaries?.length ??
        t?.group?.stakeholders?.length ??
        t?.count;
      if (directCount != null && directCount > 0) return acc + directCount;
      if (groupCountMap && t?.groupId && groupCountMap.has(t.groupId)) {
        return acc + (groupCountMap.get(t.groupId) ?? 0);
      }
      return acc;
    }, 0);
  }, [record.targets, groupCountMap]);

  const { delivered, total } = useMemo(() => {
    let targetDelivered = 0;
    let targetTotal = 0;
    let hasTargetCounts = false;

    for (const t of (record.targets ?? []) as any[]) {
      if (t?.counts) {
        hasTargetCounts = true;
        targetDelivered += Number(t.counts.SUCCESS ?? 0);
        const s = Number(t.counts.SUCCESS ?? 0);
        const f = Number(t.counts.FAIL ?? 0);
        const p = Number(t.counts.PENDING ?? 0);
        const sc = Number(t.counts.SCHEDULED ?? 0);
        const tTot = Number(t.counts.TOTAL ?? (s + f + p + sc));
        targetTotal += tTot;
      }
    }

    if (hasTargetCounts) {
      const tot = totalAudience > 0 ? totalAudience : targetTotal > 0 ? targetTotal : record.recipients;
      return { delivered: targetDelivered, total: tot };
    }

    if (entry?.data) {
      const counts = entry.data;
      const d = counts.SUCCESS ?? 0;
      const f = counts.FAIL ?? 0;
      const p = (counts.PENDING ?? 0) + (counts.SCHEDULED ?? 0);
      const sessionTotal = counts.TOTAL ?? (d + f + p);
      const tot = totalAudience > 0 ? totalAudience : sessionTotal > 0 ? sessionTotal : 0;
      return { delivered: d, total: tot };
    }

    const deliveredCount = (record.targets ?? []).reduce((acc: number, t: any) => {
      if (
        t?.status === 'COMPLETED' ||
        t?.status === 'SUCCESS' ||
        t?.status === 'DELIVERED'
      ) {
        const directCount =
          t?.group?.count ??
          t?.group?._count?.beneficiaries ??
          t?.group?._count?.stakeholders ??
          t?.group?.beneficiaries?.length ??
          t?.group?.stakeholders?.length ??
          t?.count ??
          (groupCountMap && t?.groupId ? groupCountMap.get(t.groupId) : 0) ??
          0;
        return acc + directCount;
      }
      return acc;
    }, 0);

    const tot = totalAudience > 0 ? totalAudience : record.recipients;
    return { delivered: deliveredCount, total: tot };
  }, [entry?.data, totalAudience, record.targets, record.recipients, groupCountMap]);

  const groupsCount = (record.targets ?? []).length;
  const tooltipContent = (
    <div className="flex flex-col gap-0.5 text-xs">
      <div className="font-semibold text-foreground">
        {formatDigits(delivered)} / {formatDigits(total)} {translateValue(t, 'DELIVERED', { fallback: 'Delivered' })}
      </div>
      <div className="text-muted-foreground text-[11px]">
        {formatDigits(total)} {translateValue(t, 'TOTAL_AUDIENCE', { fallback: 'total audience' })}
        {groupsCount > 0
          ? ` • ${formatDigits(groupsCount)} ${
              groupsCount === 1
                ? translateValue(t, 'GROUP_NAME_LABEL', { fallback: 'group' })
                : translateValue(t, 'GROUPS_SELECTED', { fallback: 'groups' })
            }`
          : ''}
      </div>
    </div>
  );

  return (
    <CommunicationTooltip content={tooltipContent}>
      <span className="text-xs font-medium text-foreground whitespace-nowrap cursor-default">
        {formatDigits(delivered)}/{formatDigits(total)}
      </span>
    </CommunicationTooltip>
  );
}

export const CommunicationRowDeliveryRateCell = CommunicationRowDeliveryStatusCell;

function CommunicationRowActionsCell({
  record,
  projectId,
  t,
  router,
  triggerBroadcast,
  groupCountMap,
}: {
  record: CommunicationRecord;
  projectId: string;
  t: (key: string) => string;
  router: any;
  triggerBroadcast: any;
  groupCountMap?: Map<string, number>;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const commId = record.id;
  const targets = record.targets ?? [];
  const hasTriggerableTargets =
    targets.length > 0 &&
    targets.every((tr) => tr.status === 'PENDING' || tr.status === 'FAILED');
  const hasActiveOrSent = targets.some(
    (tr) => tr.status === 'SENT' || tr.status === 'PROCESSING' || tr.sessionId,
  );
  const canSend = hasTriggerableTargets && !hasActiveOrSent;

  const totalAudience = useMemo(() => {
    return targets.reduce((acc: number, t: any) => {
      const directCount =
        t?.group?.count ??
        t?.group?._count?.beneficiaries ??
        t?.group?._count?.stakeholders ??
        t?.group?.beneficiaries?.length ??
        t?.group?.stakeholders?.length ??
        t?.count;
      if (directCount != null && directCount > 0) return acc + directCount;
      if (groupCountMap && t?.groupId && groupCountMap.has(t.groupId)) {
        return acc + (groupCountMap.get(t.groupId) ?? 0);
      }
      return acc;
    }, 0);
  }, [targets, groupCountMap]);

  const handleConfirmSend = () => {
    if (triggerBroadcast.isPending) return;
    triggerBroadcast.mutate(
      {
        projectUUID: projectId as UUID,
        communicationUUID: commId,
      },
      {
        onSettled: () => {
          setIsConfirmOpen(false);
        },
      },
    );
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <span
          onClick={() =>
            router.push(`/projects/aa/${projectId}/communications/${commId}`)
          }
        >
          <TooltipComponent
            Icon={Eye}
            tip={t('VIEW_DETAILS')}
            iconStyle="hover:text-primary cursor-pointer text-muted-foreground"
          />
        </span>
        {canSend && (
          <span onClick={() => setIsConfirmOpen(true)}>
            <TooltipComponent
              Icon={SendHorizontal}
              tip={
                record.isScheduled
                  ? t('SEND_NOW') || 'Send Now'
                  : t('SEND_COMMUNICATION') || 'Send Communication'
              }
              iconStyle="hover:text-primary cursor-pointer text-muted-foreground"
            />
          </span>
        )}
      </div>

      {canSend && (
        <SendCommunicationConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSend}
          isPending={triggerBroadcast.isPending}
          title={record.title}
          channel={record.channel}
          recipientsCount={totalAudience > 0 ? totalAudience : record.recipients}
          groupsCount={targets.length}
        />
      )}
    </>
  );
}

export default function useCommunicationsTableColumns() {
  const t = useTranslations('AA_PROJECT');
  const formatDate = useDateFormat();
  const { id: projectId } = useParams();
  const router = useRouter();
  const triggerBroadcast = useTriggerCommunicationBroadcast();
  const formatDigits = useLabelDigits();

  const { data: beneficiaryGroupsData } = useBeneficiariesGroups(
    (projectId as UUID) || '',
    { page: 1, perPage: 100 },
  );
  const { data: stakeholderGroupsData } = useStakeholdersGroups(
    (projectId as UUID) || '',
    { page: 1, perPage: 100 },
  );

  const groupCountMap = useMemo(() => {
    const map = new Map<string, number>();
    const bList = Array.isArray((beneficiaryGroupsData as any)?.data)
      ? (beneficiaryGroupsData as any).data
      : Array.isArray(beneficiaryGroupsData)
      ? beneficiaryGroupsData
      : [];
    bList.forEach((g: any) => {
      const count =
        g?._count?.beneficiaries ??
        g?.groupedBeneficiaries?.length ??
        g?.beneficiaries?.length ??
        g?.count ??
        0;
      if (g?.uuid) map.set(g.uuid, count);
      if (g?.id) map.set(g.id, count);
    });

    const sList = Array.isArray((stakeholderGroupsData as any)?.data)
      ? (stakeholderGroupsData as any).data
      : Array.isArray(stakeholderGroupsData)
      ? stakeholderGroupsData
      : [];
    sList.forEach((g: any) => {
      const count =
        g?._count?.stakeholders ??
        g?.stakeholders?.length ??
        g?.count ??
        0;
      if (g?.uuid) map.set(g.uuid, count);
      if (g?.id) map.set(g.id, count);
    });
    return map;
  }, [beneficiaryGroupsData, stakeholderGroupsData]);

  const columns: ColumnDef<CommunicationRecord>[] = [
    {
      accessorKey: 'title',
      header: t('COMMUNICATION'),
      meta: { className: 'min-w-[200px]' },
      cell: ({ row }) => {
        const title = (row.getValue('title') as string) || '';
        return (
          <div className="py-1 min-w-0 pr-2">
            <CommunicationTooltip content={title}>
              <span className="block font-medium text-sm text-foreground truncate cursor-default">
                {title}
              </span>
            </CommunicationTooltip>
          </div>
        );
      },
    },
    {
      accessorKey: 'channel',
      header: t('CHANNEL'),
      meta: { className: 'w-[100px]' },
      cell: ({ row }) => {
        const channel = row.getValue('channel') as string;
        return (
          <div className="flex items-center gap-1.5">
            <CommunicationChannelIcon
              channel={channel}
              className="h-3.5 w-3.5 text-muted-foreground shrink-0"
            />
            <span className="text-xs font-medium whitespace-nowrap">{t(channel ? channel.toUpperCase() : 'SMS')}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'targetAudience',
      header: t('TARGET_AUDIENCE'),
      meta: { className: 'w-[200px]' },
      cell: ({ row }) => {
        const aud = row.getValue('targetAudience') as CommunicationRecord['targetAudience'];
        const benCount = aud.beneficiaries?.length || 0;
        const stakeCount = aud.stakeholders?.length || 0;

        return (
          <div className="flex flex-col gap-1 w-full max-w-[190px] min-w-0">
            {benCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-medium truncate max-w-full w-max"
              >
                {`${formatDigits(benCount)} ${t('BENEFICIARY_GROUPS')}`}
              </Badge>
            )}
            {stakeCount > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-medium truncate max-w-full w-max bg-white"
              >
                {`${formatDigits(stakeCount)} ${t('STAKEHOLDER_GROUPS').replace(/(?::|ः)$/, '')}`}
              </Badge>
            )}
            {benCount === 0 && stakeCount === 0 && (
              <span className="text-xs text-muted-foreground italic">
                {t('NONE_SPECIFIED')}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: t('STATUS'),
      meta: { className: 'w-[120px]' },
      cell: ({ row }) => <CommunicationRowStatusCell record={row.original} />,
    },
    {
      accessorKey: 'delivered',
      header: translateValue(t, 'DELIVERY_STATUS', { fallback: 'Delivery Status' }),
      meta: { className: 'w-[130px]' },
      cell: ({ row }) => (
        <CommunicationRowDeliveryStatusCell
          record={row.original}
          groupCountMap={groupCountMap}
        />
      ),
    },
    {
      accessorKey: 'date',
      header: t('DATE'),
      meta: { className: 'w-[180px]' },
      cell: ({ row }) => {
        const dateVal = row.getValue('date') as string;
        const formatted = dateVal
          ? formatDate(dateVal, 'MMM d, yyyy, h:mm a') || dateVal
          : '-';
        return (
          <span className="text-xs text-muted-foreground whitespace-nowrap block">
            {formatted}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: t('ACTION'),
      enableHiding: false,
      meta: { className: 'w-[80px]' },
      cell: ({ row }) => (
        <CommunicationRowActionsCell
          record={row.original}
          projectId={projectId as string}
          t={t}
          router={router}
          triggerBroadcast={triggerBroadcast}
          groupCountMap={groupCountMap}
        />
      ),
    },
  ];

  return columns;
}
