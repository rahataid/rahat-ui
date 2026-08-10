'use client';

import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Role } from '@rumsan/sdk/types';
import RoleDetail from './roleDetail';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

export const useRoleTableColumns = () => {
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('USERS_ROLES_PERMISSIONS');
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const formatDate = useDateFormat();

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
      cell: ({ row }) => (
        <div>{formatDate(row.getValue('createdAt'), 'PPP')}</div>
      ),
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
