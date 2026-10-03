'use client';

import { useParams, useRouter } from 'next/navigation';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { Eye, MessageSquare, PhoneCall, Mail, SendHorizontal } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { aggregateTargetStatus } from '../utils/communications.utils';
import { useTriggerCommunicationBroadcast } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { CommunicationStatusBadge } from './communication-status-badge';
import { CommunicationChannelIcon } from './communication-channel-icon';

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
  status: 'DELIVERED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
  date: string;
};

export type BackendCommunication = {
  uuid: string;
  title: string;
  message?: string | null;
  subject?: string | null;
  audioURL?: { mediaURL?: string; fileName?: string } | null;
  transportId?: string | null;
  createdBy?: string | null;
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
  const targets = item?.targets ?? [];
  const beneficiaries = targets
    .filter((target) => target?.groupType === 'BENEFICIARY')
    .map((target) => target.groupId);
  const stakeholders = targets
    .filter((target) => target?.groupType === 'STAKEHOLDERS' || target?.groupType === 'STAKEHOLDER')
    .map((target) => target.groupId);
  const delivered = targets.filter(
    (target) =>
      target?.status === 'SENT' ||
      target?.status === 'DELIVERED' ||
      target?.status === 'SUCCESS' ||
      target?.status === 'COMPLETED',
  ).length;
  const failed = targets.filter(
    (target) => target?.status === 'FAILED' || target?.status === 'FAIL',
  ).length;
  const message =
    typeof item?.message === 'string'
      ? item.message
      : item?.subject ?? '';

  return {
    id: item.uuid,
    title: item.title,
    description: message,
    channel,
    targetAudience: { beneficiaries, stakeholders },
    recipients: targets.length,
    delivered,
    failed,
    sender: item.createdBy ?? undefined,
    status: aggregateTargetStatus(targets),
    date: item.createdAt,
  };
};

export default function useCommunicationsTableColumns() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const formatDate = useDateFormat();
  const { id: projectId } = useParams();
  const router = useRouter();
  const triggerBroadcast = useTriggerCommunicationBroadcast();
  const columns: ColumnDef<CommunicationRecord>[] = [
    {
      accessorKey: 'title',
      header: t("COMMUNICATION"),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="py-1">
            <div className="font-medium text-sm text-foreground">
              {item.title}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {item.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'channel',
      header: t("CHANNEL"),
      meta: { className: 'w-[120px]' },
      cell: ({ row }) => {
        const channel = row.getValue('channel') as string;
        return (
          <div className="flex items-center gap-1.5">
            <CommunicationChannelIcon channel={channel} className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{t(channel)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'targetAudience',
      header: t("TARGET_AUDIENCE"),
      cell: ({ row }) => {
        const aud = row.getValue('targetAudience') as CommunicationRecord['targetAudience'];
        const benCount = aud.beneficiaries?.length || 0;
        const stakeCount = aud.stakeholders?.length || 0;

        return (
          <div className="flex flex-col gap-1 w-full max-w-[200px]">
            {benCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium line-clamp-1 w-max">
                {`${formatDigits(benCount)} ${t("BENEFICIARY_GROUPS")}`}
              </Badge>
            )}
            {stakeCount > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium line-clamp-1 w-max bg-white">
                {`${formatDigits(stakeCount)} ${t("STAKEHOLDER_GROUPS")}`}
              </Badge>
            )}
            {benCount === 0 && stakeCount === 0 && (
              <span className="text-xs text-muted-foreground italic">{t("NONE_SPECIFIED")}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: t("STATUS"),
      meta: { className: 'w-[130px]' },
      cell: ({ row }) => <CommunicationStatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'delivered',
      header: t("DELIVERY_RATE"),
      meta: { className: 'w-[180px]' },
      cell: ({ row }) => {
        const item = row.original;
        const percent = item.recipients > 0 ? Math.round((item.delivered / item.recipients) * 100) : 0;
        return (
          <div className="space-y-1 w-full max-w-[150px]">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatDigits(percent)}%</span>
              <span>
                {formatDigits(item.delivered)}/{formatDigits(item.recipients)}
              </span>
            </div>
            <Progress value={percent} className="h-1.5" />
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: t("DATE"),
      meta: { className: 'w-[120px]' },
      cell: ({ row }) => {
        const dateVal = row.getValue('date') as string;
        return (
          <span className="text-xs text-muted-foreground">
            {formatDate(dateVal, 'yyyy-MM-dd') || dateVal}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: t('ACTION'),
      enableHiding: false,
      meta: { className: 'w-[100px]' },
      cell: ({ row }) => {
        const commId = row.original.id;
        const isSent = row.original.status === 'DELIVERED';

        const handleSend = () => {
          if (triggerBroadcast.isPending) return;
          triggerBroadcast.mutate({
            projectUUID: projectId as UUID,
            communicationUUID: commId,
          });
        };

        return (
          <div className="flex items-center space-x-2">
            <span onClick={() => router.push(`/projects/aa/${projectId}/communications/${commId}`)}>
              <TooltipComponent
                Icon={Eye}
                tip={t('VIEW_DETAILS')}
                iconStyle="hover:text-primary cursor-pointer text-muted-foreground"
              />
            </span>
            {!isSent && (
              <span onClick={handleSend}>
                <TooltipComponent
                  Icon={SendHorizontal}
                  tip={t('SEND_BROADCAST')}
                  iconStyle="hover:text-primary cursor-pointer text-muted-foreground"
                />
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
}
