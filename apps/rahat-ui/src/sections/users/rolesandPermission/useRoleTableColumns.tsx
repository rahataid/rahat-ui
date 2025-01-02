'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Role } from '@rumsan/sdk/types';
import RoleDetail from './roleDetail';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useRoleTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'isSystem',
      header: 'Is System',
      cell: ({ row }) => <Badge>{row.original.isSystem ? 'Yes' : 'No'}</Badge>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
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
      header: 'Action',
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
