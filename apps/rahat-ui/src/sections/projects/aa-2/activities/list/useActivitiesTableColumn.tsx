import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye, RefreshCcw } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

export default function useActivitiesTableColumn() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id: projectID, title } = useParams();
  const router = useRouter();
  const formatDate = useDateFormat();

  const handleEyeClick = (activityId: any) => {
    setPaginationToLocalStorage();
    router.push(
      `/projects/aa/${projectID}/activities/${activityId}?from=${title}`,
    );
  };

  const handleUpdateStatusIconClick = (activityId: any) => {
    router.push(
      `/projects/aa/${projectID}/activities/${activityId}/update-status?from=${title}`,
    );
  };

  const columns: ColumnDef<IActivitiesItem>[] = [
    {
      accessorKey: 'title',
      header: t('TITLE'),
      meta: { className: 'w-[250px]' },
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('title') || ''} truncateByWidth />
      ),
    },
    {
      accessorKey: 'category',
      header: t('CATEGORY'),
      meta: { className: 'w-[130px]' },
      cell: ({ row }) => {
        const rawCategory = (row.getValue('category') as string) || '';
        const translatedCategory = translateValue(t, rawCategory, {
          fallbackStyle: 'raw',
        });
        return (
          <Badge className="rounded-xl capitalize text-xs font-normal text-muted-foreground">
            <TruncatedCell text={translatedCategory} maxLength={15} />
          </Badge>
        );
      },
    },

    {
      accessorKey: 'isAutomated',
      header: tg('TYPE'),
      meta: { className: 'w-[80px]' },
      cell: ({ row }) => (
        <Badge className="rounded-xl capitalize text-xs font-normal text-muted-foreground">
          {row.getValue('isAutomated') ? t('AUTOMATED') : t('MANUAL')}
        </Badge>
      ),
    },
    {
      accessorKey: 'responsibility',
      header: t('RESPONSIBILITY'),
      meta: { className: 'w-[130px]' },
      cell: ({ row }) => {
        const val = (row.getValue('responsibility') as string) || '';
        const text = val ? translateValue(tg, val, { fallback: val }) : tg('N_A');
        return <TruncatedCell text={text} maxLength={15} />;
      },
    },
    {
      accessorKey: 'responsibleStation',
      header: t('RESPONSIBLE_STATION'),
      meta: { className: 'w-[120px]' },
      cell: ({ row }) => {
        const val = (row.getValue('responsibleStation') as string) || '';
        const text = val ? translateValue(tg, val, { fallback: val }) : tg('N_A');
        return <TruncatedCell text={text} maxLength={10} />;
      },
    },
    {
      accessorKey: 'status',
      header: tg('STATUS'),
      meta: { className: 'w-[100px]' },
      cell: ({ row }) => {
        const rawStatus = (row.getValue('status') as string) || '';
        const devV2FormattedStatus = rawStatus
          ? rawStatus
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          : '';
        const translatedStatus = translateValue(tg, rawStatus, {
          fallback: devV2FormattedStatus,
        });
        return (
          <Badge className={getStatusBg(rawStatus || devV2FormattedStatus)}>
            <TruncatedCell text={translatedStatus} maxLength={10} />
          </Badge>
        );
      },
    },
    {
      header: t('COMPLETED_BY'),
      meta: { className: 'w-[110px]' },
      cell: ({ row }) => {
        const completedBy = row.original?.completedBy;
        const completedAt = row.original?.completedAt;
        return (
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">
              {completedBy || tg('N_A')}
            </span>
            <span className="text-muted-foreground">
              {completedAt ? formatDate(completedAt) : tg('N_A')}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: tg('ACTION'),
      meta: { className: 'w-[60px]' },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <TooltipComponent
              Icon={Eye}
              tip={t('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleEyeClick(row.original?.id)}
            />
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
              hasContent={false}
            >
              <TooltipComponent
                Icon={RefreshCcw}
                tip={t('UPDATE_ACTIVITY_STATUS')}
                iconStyle="hover:text-primary cursor-pointer"
                handleOnClick={() =>
                  handleUpdateStatusIconClick(row.original?.id)
                }
              />
            </RoleAuth>
          </div>
        );
      },
    },
  ];

  return columns;
}
