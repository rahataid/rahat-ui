'use client';

import { useParams, useRouter } from 'next/navigation';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { Eye, MessageSquare, PhoneCall, Mail } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

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
  status: 'DELIVERED' | 'IN_PROGRESS' | 'FAILED';
  date: string;
};

export default function useCommunicationsTableColumns() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const formatDate = useDateFormat();
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
        let Icon = MessageSquare;
        if (channel === 'VOICE') Icon = PhoneCall;
        if (channel === 'EMAIL') Icon = Mail;

        return (
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
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
                {benCount === 1
                  ? aud.beneficiaries[0]
                  : `${formatDigits(benCount)} ${t("BENEFICIARY_GROUPS")}`}
              </Badge>
            )}
            {stakeCount > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium line-clamp-1 w-max bg-white">
                {stakeCount === 1
                  ? aud.stakeholders[0]
                  : `${formatDigits(stakeCount)} ${t("STAKEHOLDER_GROUPS")}`}
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
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        let badgeClass = 'bg-green-100 text-green-700 hover:bg-green-100';
        if (status === 'IN_PROGRESS')
          badgeClass = 'bg-blue-100 text-blue-700 hover:bg-blue-100';
        if (status === 'FAILED')
          badgeClass = 'bg-red-100 text-red-700 hover:bg-red-100';

        return (
          <Badge className={`text-[11px] font-normal border-none ${badgeClass}`}>
            {t(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'delivered',
      header: t("DELIVERY_RATE"),
      meta: { className: 'w-[180px]' },
      cell: ({ row }) => {
        const item = row.original;
        const percent = Math.round((item.delivered / item.recipients) * 100);
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
            {formatDate(dateVal, 'yyyy-MM-dd') || formatDigits(dateVal)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: t('ACTION'),
      enableHiding: false,
      meta: { className: 'w-[70px]' },
      cell: ({ row }) => {
        const { id: projectId } = useParams();
        const router = useRouter();
        const commId = row.original.id;

        return (
          <div className="flex items-center space-x-2">
            <span onClick={() => router.push(`/projects/aa/${projectId}/communications/${commId}`)}>
              <TooltipComponent
                Icon={Eye}
                tip={t('VIEW_DETAILS')}
                iconStyle="hover:text-primary cursor-pointer text-muted-foreground"
              />
            </span>
          </div>
        );
      },
    },
  ];

  return columns;
}
