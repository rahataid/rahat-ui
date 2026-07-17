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
          {showAll ? 'View Less' : `+${methods.length - 2} more`}
        </button>
      )}
    </div>
  );
}

export const useAASettingsPhaseColumns = (
  handleEditClick: (phase: Phase) => void,
  projectType?: string,
) => {
  const riverBasinHeader =
    projectType === 'HEAT_WAVE' ? 'Station' : 'River Basin';
  const columns: ColumnDef<Phase>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: { row: Row<Phase> }) => {
        return <TruncatedCell text={row.getValue('name')} maxLength={25} />;
      },
    },
    {
      header: 'Can Revert',
      accessorKey: 'canRevert',
      cell: ({ row }: { row: Row<Phase> }) => {
        const value = row.getValue('canRevert');
        return <div>{value ? 'Yes' : 'No'}</div>;
      },
    },
    {
      header: 'Can Trigger Payout',
      accessorKey: 'canTriggerPayout',
      cell: ({ row }: { row: Row<Phase> }) => {
        const value = row.getValue('canTriggerPayout');
        return <div>{value ? 'Yes' : 'No'}</div>;
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
      header: 'Is Automated Activity',
      accessorKey: 'isAutomatedActivity',
      cell: ({ row }: { row: Row<Phase> }) => {
        const value = row.getValue('isAutomatedActivity');
        return <div>{value ? 'Yes' : 'No'}</div>;
      },
    },
    {
      header: 'Disbursement Method',
      accessorKey: 'disbursementConfig',
      cell: ({ row }: { row: Row<Phase> }) => {
        const disbursementConfig = row.getValue(
          'disbursementConfig',
        ) as Phase['disbursementConfig'];
        const disbursementMethods = disbursementConfig?.disbursementMethods;
        return disbursementMethods?.length ? (
          <DisbursementCell methods={disbursementMethods} />
        ) : (
          'N/A'
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
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
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];
  return columns;
};
