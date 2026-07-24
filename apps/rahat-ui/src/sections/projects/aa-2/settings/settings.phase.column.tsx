import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import React, { useState } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

import { Edit } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { DISBURSEMENT_COLORS, formatMethod } from '../triggerStatement/utils';
import { Phase } from './aa.phases';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';

function DisbursementCell({ methods }: { methods: string[] }) {
  const t = useTranslations('AA Project');
  const formatNum = useNumberFormat();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? methods : methods.slice(0, 2);

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {visible.map((method, i) => (
        <Badge
          key={method}
          className={`${DISBURSEMENT_COLORS[i % DISBURSEMENT_COLORS.length]} text-[9px] font-medium px-2 py-0.5 rounded-sm`}
        >
          {formatMethod(method)}
        </Badge>
      ))}
      {methods.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[10px] text-primary underline cursor-pointer ml-1"
        >
          {showAll ? t('VIEW_LESS') : `+${formatNum(methods.length - 2)} ${t('MORE')}`}
        </button>
      )}
    </div>
  );
}

export const useAASettingsPhaseColumns = (
  handleEditClick: (phase: Phase) => void,
  projectType?: string,
) => {
  const t = useTranslations('AA Project');
  const riverBasinHeader =
    projectType === 'HEAT_WAVE' ? t('STATION') : t('RIVER_BASIN');
  const columns: ColumnDef<Phase>[] = [
    {
      header: t('NAME'),
      accessorKey: 'name',
      cell: ({ row }: { row: Row<Phase> }) => {
        return <TruncatedCell text={row.getValue('name')} maxLength={25} />;
      },
    },
    {
      header: t('CAN_REVERT'),
      accessorKey: 'canRevert',
      cell: ({ row }: { row: Row<Phase> }) => {
        const value = row.getValue('canRevert');
        return <div>{value ? t('YES') : t('NO')}</div>;
      },
    },
    {
      header: t('CAN_TRIGGER_PAYOUT'),
      accessorKey: 'canTriggerPayout',
      cell: ({ row }: { row: Row<Phase> }) => {
        const value = row.getValue('canTriggerPayout');
        return <div>{value ? t('YES') : t('NO')}</div>;
      },
    },
    {
      header: riverBasinHeader,
      accessorKey: 'riverBasin',
      cell: ({ row }: { row: Row<Phase> }) => {
        return (
          <TruncatedCell text={row.getValue('riverBasin')} maxLength={25} />
        );
      },
    },
    {
      header: t('IS_AUTOMATED_ACTIVITY'),
      accessorKey: 'isAutomatedActivity',
      cell: ({ row }: { row: Row<Phase> }) => {
        const value = row.getValue('isAutomatedActivity');
        return <div>{value ? t('YES') : t('NO')}</div>;
      },
    },
    {
      header: t('DISBURSEMENT_METHOD'),
      accessorKey: 'disbursementConfig',
      cell: ({ row }: { row: Row<Phase> }) => {
        const disbursementConfig = row.getValue(
          'disbursementConfig',
        ) as Phase['disbursementConfig'];
        const disbursementMethods = disbursementConfig?.disbursementMethods;
        return disbursementMethods?.length ? (
          <DisbursementCell methods={disbursementMethods} />
        ) : (
          t('N_A')
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: t('ACTIONS'),
      cell: ({ row }: { row: Row<Phase> }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Edit
                size={20}
                strokeWidth={1.5}
                className="cursor-pointer hover:text-primary"
                onClick={() => handleEditClick(row.original)}
              />
            </TooltipTrigger>
            <TooltipContent>{t('EDIT')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];
  return columns;
};
