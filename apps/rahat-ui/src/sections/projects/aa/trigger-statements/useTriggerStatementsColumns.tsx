'use client';

import { useDeleteTriggerStatement } from '@rahat-ui/query';
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
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
        >
          {row.getValue('dataSource')}
        </div>
      ),
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
              <div>Danger Level: {row.original.triggerStatement.dangerLevel}</div>
              <div>Warning Level: {row.original.triggerStatement.warningLevel}</div>
            </>
          )
        }
      },
    },
    {
      accessorKey: 'triggerActivity',
      header: 'Trigger Activity',
      cell: ({ row }) => <div>{row.getValue('triggerActivity')}</div>,
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
