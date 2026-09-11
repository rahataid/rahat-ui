'use client';

import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useUserRolesRemove } from '@rumsan/react-query';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';
import React from 'react';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { ActiveUserRole } from './use.user.active.roles';

type IProps = {
  loggedUserRoles: string[];
  userUUID: UUID;
  projectNameByUuid: Record<string, string>;
};

export const useUsersRolesTableColumns = ({
  loggedUserRoles,
  userUUID,
  projectNameByUuid,
}: IProps) => {
  const t = useTranslations('USERS_DETAIL');
  const tg = useTranslations('GLOBAL');
  const removeUserRole = useUserRolesRemove();

  const deleteUserRole = async (roles: string[]) => {
    if (
      loggedUserRoles.includes('Admin') ||
      loggedUserRoles.includes('Manager')
    ) {
      await removeUserRole.mutateAsync({ uuid: userUUID, roles: roles });
      Swal.fire(t('ROLE_REMOVED_SUCCESSFULLY'), '', 'success');
    } else {
      return Swal.fire(
        t('YOU_DO_NOT_HAVE_PERMISSION_TO'),
        '',
        'warning',
      );
    }
  };

  const columns: ColumnDef<ActiveUserRole>[] = [
    {
      id: 'name',
      header: t('ROLE'),
      cell: ({ row }) => row.original?.Role?.name,
    },
    {
      id: 'project',
      header: tg('PROJECT'),
      cell: ({ row }) => {
        const xrefId = row.original?.xrefId;
        if (!xrefId) return <span className="text-muted-foreground">-</span>;
        const projectName = projectNameByUuid[xrefId] || xrefId;
        return <TruncatedCell text={projectName} maxLength={20} />;
      },
    },
    {
      id: 'actions',
      header: () => <div className="flex justify-end">{tg('ACTION')}</div>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <Trash2
              onClick={() => deleteUserRole([row.original?.Role?.name])}
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
