'use client';

import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Role } from '@rumsan/sdk/types';
import RoleDetail from './roleDetail';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useRoleTableColumns = () => {
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('USERS_ROLES_PERMISSIONS');
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: tg('NAME'),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'isSystem',
      header: t('IS_SYSTEM'),
      cell: ({ row }) => <Badge>{row.original.isSystem ? tg('YES') : tg('NO')}</Badge>,
    },
    {
      accessorKey: 'createdAt',
      header: tg('CREATED_AT'),
      cell: ({ row }) => {
        const changedDate = new Date(row.getValue('createdAt') as Date);
        const formattedDate = changedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return <div>{formattedDate}</div>;
      },
    },
    {
      id: 'actions',
      header: tg('ACTION'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <RoleDetail
                    roleData={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />
                </>,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
};
