'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const useBeneficiaryGroupsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <div
            className="cursor-pointer"
            // onClick={() => openSplitDetailView(row.original)}
          >
            {row.getValue('name')}
          </div>
        );
      },
    },
    {
      accessorKey: 'membersCount',
      header: 'Total Members',
      cell: ({ row }) => <div>{row?.original?.totalMembers}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            // onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];

  return columns;
};
