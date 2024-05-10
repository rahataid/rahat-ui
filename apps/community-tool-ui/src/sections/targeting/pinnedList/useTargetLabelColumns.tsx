'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { TargetList } from '@rahataid/community-tool-sdk/targets';
import { humanizeString } from '../../../utils';
import Link from 'next/link';

export const useTargetLabelTableColumns = () => {
  const columns: ColumnDef<TargetList>[] = [
    {
      accessorKey: 'label',
      header: 'Label',
      cell: ({ row }) => <div>{humanizeString(row.getValue('label'))}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => <div>{row?.original?.user?.name}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      header: 'Details',
      cell: ({ row }) => {
        return (
          <Link href={`/targeting/${row?.original?.uuid}`}>
            <Eye
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer hover:text-primary"
            />
          </Link>
        );
      },
    },
  ];

  return columns;
};
