'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
// import { useSecondPanel } from '../../providers/second-panel-provider';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye } from 'lucide-react';
// import BeneficiaryDetail from './beneficiaryDetail';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ListBeneficiary, ListBeneficiaryGroup } from '@rahat-ui/types';

export const useBeneficiaryGroupsTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const openSplitDetailView = (rowDetail: ListBeneficiaryGroup) => {
    setSecondPanelComponent(
      <p>second component</p>,
      // <BeneficiaryDetail
      //   beneficiaryDetail={rowDetail}
      //   closeSecondPanel={closeSecondPanel}
      // />,
    );
  };

  const columns: ColumnDef<ListBeneficiaryGroup>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
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
