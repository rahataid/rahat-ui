import { useTranslations } from 'next-intl';
import React from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import DemoTable from '../../components/table';
import { useUsersRolesTableColumns } from './use.users.roles.table.columns';
import { User } from '@rumsan/sdk/types';
import { useUserStore } from '@rumsan/react-query';
import { useProjectList } from '@rahat-ui/query';
import { UUID } from 'crypto';
import AssignRoleDialog from './assign.role.dialog';
import { useUserActiveRoles } from './use.user.active.roles';
import ConfirmationDialog from '../../common/confirmationDialog';
import { useBoolean } from '../../hooks/use-boolean';
import { useState } from 'react';

type IProps = {
  userDetail: User;
};

export default function UsersRolesTabSplitView({ userDetail }: IProps) {
  const t = useTranslations('USERS_DETAIL');
  const user = useUserStore((state) => state.user);
  const loggedUserRoles = React.useMemo(() => user?.data?.roles, [user]);
  const deleteRoleConfirmDialog = useBoolean(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const { data: roleList, isLoading } = useUserActiveRoles(
    userDetail?.uuid as UUID,
  );
  const { data: projectList } = useProjectList();

  const projectNameByUuid = React.useMemo(() => {
    const map: Record<string, string> = {};
    (projectList?.data || []).forEach((project) => {
      if (project.uuid && project.name) {
        map[project.uuid] = project.name;
      }
    });
    return map;
  }, [projectList]);

  const handleDelete = (roleName: string) => {
    setRoleToDelete(roleName);
    deleteRoleConfirmDialog.onTrue();
  };

  const deleteConfirmation = async () => {
    if (!roleToDelete) return;
    await deleteUserRole([roleToDelete]);
    setRoleToDelete(null);
    deleteRoleConfirmDialog.onFalse();
  };
  const { columns, deleteUserRole, isDeleting } = useUsersRolesTableColumns({
    loggedUserRoles,
    userUUID: userDetail?.uuid as UUID,
    projectNameByUuid,
    handleDelete,
  });
  const table = useReactTable({
    manualPagination: true,
    data: roleList?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-medium">{t('USER_ROLES')}</h1>
        {(loggedUserRoles?.includes('Admin') ||
          loggedUserRoles?.includes('Manager')) && (
          <AssignRoleDialog userDetails={userDetail} />
        )}
      </div>
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-400px)]"
        loading={isLoading}
      />
      <ConfirmationDialog
        isConfirmationDialogOpen={deleteRoleConfirmDialog.value}
        onCancel={() => deleteRoleConfirmDialog.onFalse()}
        onConfirm={deleteConfirmation}
        dialogTitle={t('DELETE_ROLE')}
        dialogMessage={t('DELTE_ROLE_COMFIRMATION')}
        isDestructive
        isPending={isDeleting}
      />
    </div>
  );
}
