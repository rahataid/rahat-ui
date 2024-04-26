'use client';

import { useDeleteTriggerStatement } from '@rahat-ui/query';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { TrashIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

export const useTriggerStatementTableColumns = () => {
  const { id: projectID } = useParams()
  const deleteTriggerStatement = useDeleteTriggerStatement()

  const deleteRow = (row: any) => {
    deleteTriggerStatement.mutateAsync({
      projectUUID: projectID as UUID,
      triggerStatementPayload: {
        repeatKey: row.repeatKey
      }
    })
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'dataSource',
      header: 'Data Source',
      cell: ({ row }) => {
        if (row.getValue('dataSource') === 'DHM') {
          return (
            <>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    DHM
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary ">
                    <p className="text-xs font-medium">Department of Hydrology and Meteorology</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )
        }
      },
    },
    {
      accessorKey: 'location',
      header: 'River Basin',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
        >
          {row.getValue('location')}
        </div>
      ),
    },
    {
      accessorKey: 'triggerStatement',
      header: 'Trigger Statement',
      cell: ({ row }) => {
        if (row.getValue('dataSource') === 'DHM') {
          return (
            <>
              <div>Readiness Level: {row.original.triggerStatement.readinessLevel}</div>
              <div>Activation Level: {row.original.triggerStatement.activationLevel}</div>
            </>
          )
        }
      },
    },
    {
      accessorKey: 'triggerActivity',
      header: 'Trigger Activity',
      cell: ({ row }) => {
        const triggerActivities = row.getValue('triggerActivity');

        if (Array.isArray(triggerActivities) && triggerActivities.length) {
          return (
            <>
              {triggerActivities.map((activity, index) => (
                <div key={index}>{activity}</div> 
              ))}
            </>
          );
        } else {
          return <div>N/A</div>; 
        }
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <TrashIcon
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() => deleteRow(row.original)}
          />
        );
      },
    },
  ];

  return columns;
};

