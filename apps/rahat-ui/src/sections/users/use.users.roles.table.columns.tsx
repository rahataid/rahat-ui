'use client';

import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useUserRolesRemove } from '@rumsan/react-query';
import { UUID } from 'crypto';
import React from 'react';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { ActiveUserRole } from './use.user.active.roles';
import { toast } from 'react-toastify';

type IProps = {
  loggedUserRoles: string[];
  userUUID: UUID;
  projectNameByUuid: Record<string, string>;
  handleDelete: (roleName: string, xrefId?: string | null) => void;
};

export const useUsersRolesTableColumns = ({
  loggedUserRoles,
  userUUID,
  projectNameByUuid,
  handleDelete,
}: IProps) => {
  const t = useTranslations('USERS_DETAIL');
  const tg = useTranslations('GLOBAL');
  const removeUserRole = useUserRolesRemove();

  const deleteUserRole = async (roles: string[], xrefId?: string | null) => {
    if (
      loggedUserRoles.includes('Admin') ||
      loggedUserRoles.includes('Manager')
    ) {
      await removeUserRole.mutateAsync({
        uuid: userUUID,
        roles,
        ...(xrefId ? { xrefId } : {}),
      });
      toast.success(t('ROLE_REMOVED_SUCCESSFULLY'));
    } else {
      return toast.error(t('YOU_DO_NOT_HAVE_PERMISSION_TO'));
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
        console.log('xrefId:', row.original?.xrefId);
        return (
          <div className="flex justify-end">
            <Trash2
              onClick={() =>
                handleDelete(row.original.Role.name, row.original?.xrefId)
              }
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  return {
    columns,
    deleteUserRole,
    isDeleting: removeUserRole.isPending,
  };
};
