import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

export const useTriggerStatementTableColumns = () => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const router = useRouter();
  const formatDate = useDateFormat();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: t('TITLE'),
      cell: ({ row }) => {
        return <div className="w-80">{row.getValue('title')}</div>;
      },
    },
    {
      accessorKey: 'dataSource',
      header: t('DATA_SOURCE'),
      cell: ({ row }) => {
        if (row.getValue('dataSource') === 'DHM') {
          return (
            <>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>DHM</TooltipTrigger>
                  <TooltipContent className="bg-secondary ">
                    <p className="text-xs font-medium">
                      {t('DHM_FULL')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          );
        }
        return row.getValue('dataSource');
      },
    },
    {
      accessorKey: 'location',
      header: t('RIVER_BASIN'),
      cell: ({ row }) => (
        <div className="cursor-pointer w-max">
          {row.getValue('location') || t('NA')}
        </div>
      ),
    },
    {
      accessorKey: 'phase',
      header: t('PHASE'),
      cell: ({ row }) => (
        <div className="cursor-pointer w-max">
          {row.original?.phase?.name || t('NA')}
        </div>
      ),
    },
    {
      accessorKey: 'isMandatory',
      header: tg('TYPE'),
      cell: ({ row }) => {
        const isMandatory = row.getValue('isMandatory');
        return <Badge>{isMandatory ? t('REQUIRED') : t('OPTIONAL')}</Badge>;
      },
    },
    {
      accessorKey: 'isTriggered',
      header: tg('STATUS'),
      cell: ({ row }) => {
        const isTriggered = row.getValue('isTriggered');
        return (
          <Badge
            className={
              !isTriggered
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }
          >
            {isTriggered ? t('TRIGGERED') : t('NOT_TRIGGERED')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'triggeredAt',
      header: t('TRIGGERED_AT'),
      cell: ({ row }) => {
        const triggeredAt = row.getValue('triggeredAt') as string;
        if (triggeredAt) {
          return formatDate(triggeredAt);
        }
        return t('NA');
      },
    },
    {
      accessorKey: 'triggeredBy',
      header: t('TRIGGERED_BY'),
      cell: ({ row }) => {
        const triggeredBy = row.getValue('triggeredBy') as string;
        if (triggeredBy) {
          return triggeredBy;
        }
        return t('NA');
      },
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 w-max">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/trigger-statements/${row.original.repeatKey}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
