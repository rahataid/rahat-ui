'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye, MoreVertical } from 'lucide-react';
import { ListBeneficiaryGroup } from '@rahat-ui/types';

import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import BeneficiaryGroupDetail from './beneficiaryGroupDetail';

export const useBeneficiaryGroupsTableColumns = () => {
  // const projectModal = useBoolean();

  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const openSplitDetailView = (rowDetail: ListBeneficiaryGroup) => {
    setSecondPanelComponent(
      <BeneficiaryGroupDetail
        beneficiaryGroupDetail={rowDetail}
        closeSecondPanel={closeSecondPanel}
      />,
    );
  };

  const columns: ColumnDef<ListBeneficiaryGroup>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         disabled={!row.getCanSelect()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
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
          <>
            <div className="flex gap-3 items-center">
              <Eye
                size={20}
                strokeWidth={1.5}
                className="cursor-pointer hover:text-primary"
                onClick={() => openSplitDetailView(row.original)}
              />
            </div>
          </>
        );
      },
    },
  ];

  return columns;
};
