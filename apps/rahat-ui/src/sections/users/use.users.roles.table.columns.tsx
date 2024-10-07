'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User } from '@rumsan/sdk/types';
import { Trash2 } from 'lucide-react';

export const useUsersRolesTableColumns = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        return row.getValue('role');
      },
    },

    {
      id: 'actions',
      header: () => <div className="flex justify-end">Action</div>,
      enableHiding: false,
      cell: () => {
        return (
          <div className="flex justify-end">
            <Trash2 size={20} strokeWidth={1.5} className="cursor-pointer" />
          </div>
        );
      },
    },
  ];

  return columns;
};
