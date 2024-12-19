'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserRole } from '@rumsan/sdk/types';
import { Trash2 } from 'lucide-react';
import { useUserRolesRemove } from '@rumsan/react-query';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';
import React from 'react';

type IProps = {
  loggedUserRoles: string[];
  userUUID: UUID;
};

export const useUsersRolesTableColumns = ({
  loggedUserRoles,
  userUUID,
}: IProps) => {
  const removeUserRole = useUserRolesRemove();

  const deleteUserRole = async (roles: string[]) => {
    if (
      loggedUserRoles.includes('Admin') ||
      loggedUserRoles.includes('Manager')
    ) {
      await removeUserRole.mutateAsync({ uuid: userUUID, roles: roles });
      Swal.fire('Role Removed Successfully', '', 'success');
    } else {
      return Swal.fire(
        'You do not have permission to remove role',
        '',
        'warning',
      );
    }
  };

  const columns: ColumnDef<UserRole>[] = [
    {
      accessorKey: 'name',
      header: 'Role',
      cell: ({ row }) => {
        return row.getValue('name');
      },
    },

    {
      id: 'actions',
      header: () => <div className="flex justify-end">Action</div>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Trash2
              onClick={() => deleteUserRole([row?.original?.name])}
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
