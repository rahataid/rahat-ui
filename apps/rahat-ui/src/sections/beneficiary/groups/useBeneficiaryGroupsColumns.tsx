'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { ListBeneficiaryGroup } from '@rahat-ui/types';

import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import BeneficiaryGroupDetail from './beneficiaryGroupDetail';

export const useBeneficiaryGroupsTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const openSplitDetailView = React.useCallback(
    (rowDetail: ListBeneficiaryGroup) => {
      setSecondPanelComponent(
        <BeneficiaryGroupDetail
          beneficiaryGroupDetail={rowDetail}
          closeSecondPanel={closeSecondPanel}
        />,
      );
    },
    [],
  );

  const columns: ColumnDef<ListBeneficiaryGroup>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => openSplitDetailView(row.original)}
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
            onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];

  return columns;
};
