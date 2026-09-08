import { useTranslations } from 'next-intl';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
function getStatusBg(status: string | undefined) {
  if (status === 'Not Started') {
    return 'bg-gray-200 text-black';
  }

  if (status === 'Work in Progress') {
    return 'bg-orange-200 text-yellow-600';
  }

  if (status === 'Completed') {
    return 'bg-green-200 text-green-500';
  }

  return 'bg-red-200 text-red-600';
}

function getPhaseColor(phase: string) {
  if (phase === 'PREPAREDNESS') {
    return 'bg-green-200 text-green-500';
  }
  if (phase === 'ACTIVATION') {
    return 'bg-red-200 text-red-500';
  }
  if (phase === 'READINESS') {
    return 'bg-yellow-200 text-yellow-500';
  }
  return '';
}
export default function useCommsActivitiesTableColumns() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const router = useRouter();
  const { id } = useParams();
  const formatDate = useDateFormat();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: t('TITLE'),
      cell: ({ row }) => <TruncatedCell text={row.getValue('title')} />,
    },
    {
      accessorKey: 'updatedAt',
      header: t('DATE'),
      cell: ({ row }) => (
        <div className="capitalize min-w-32">
          <TruncatedCell
            text={formatDate(row.original?.updatedAt)}
            maxLength={30}
          />
        </div>
      ),
    },
    {
      accessorKey: 'phase',
      header: t('PHASE'),
      cell: ({ row }) => {
        const phase = row.getValue('phase') as string;
        const className = getPhaseColor(phase);
        // Phase names come from the API and admins can create new ones, so an
        // unmapped phase must render as-is rather than throwing MISSING_MESSAGE.
        return (
          <Badge className={className}>
            {translateValue(tg, phase, { fallbackStyle: 'raw' })}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: t('STATUS'),
      cell: ({ row }) => {
        const commStatus = row.original?.commStatus as string | undefined;
        const className = getStatusBg(commStatus);
        // commStatus values are fixed ("Not Started" / "Work in Progress" /
        // "Completed" / "Delayed"), but the matching translation keys live
        // split across AA_PROJECT and GLOBAL, so map explicitly instead of
        // deriving a key that may not exist (would render as e.g.
        // "AA_PROJECT.WORK_IN_PROGRESS").
        const statusLabel =
          commStatus === 'Not Started'
            ? t('NOT_STARTED')
            : commStatus === 'Work in Progress'
              ? t('IN_PROGRESS')
              : commStatus === 'Completed'
                ? tg('COMPLETED')
                : commStatus === 'Delayed'
                  ? tg('DELAYED')
                  : commStatus;
        return <Badge className={className}>{statusLabel}</Badge>;
      },
    },
    {
      id: 'actions',
      header: t('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <TooltipComponent
              Icon={Eye}
              tip={t('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${id}/communication-logs/details/${row.original.id}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];
  return columns;
}
