'use client';

import { useDeleteDataSource } from '@rahat-ui/query';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { TrashIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

export const useDataSourcesTableColumns = () => {
  const {id: projectID} = useParams()
  const deleteDataSource = useDeleteDataSource()

  const deleteRow = (row: any) => {
     deleteDataSource.mutateAsync({
      projectUUID: projectID as UUID,
      dataSourcePayload: {
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
      header: 'Location',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
        >
          {row.getValue('location')}
        </div>
      ),
    },
    {
      accessorKey: 'warningLevel',
      header: 'Warning Level',
      cell: ({ row }) => <div>{row.getValue('warningLevel')}</div>,
    },
    {
      accessorKey: 'dangerLevel',
      header: 'Danger Level',
      cell: ({ row }) => <div>{row.getValue('dangerLevel')}</div>,
    },
    {
      accessorKey: 'repeatEvery',
      header: 'Repeat Every',
      cell: ({ row }) => <div>{Number(row.getValue('repeatEvery'))/60000} minutes</div>,
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
