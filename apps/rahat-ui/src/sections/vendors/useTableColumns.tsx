'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { useSecondPanel } from '../../providers/second-panel-provider';
import VendorsDetailSplitView from './vendors.detail.split.view';
import { IVendor } from './vendors.list.table';

export const useTableColumns = (handleAssignClick: any) => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const handleAssign = (row: any) => {
    handleAssignClick(row);
  };

  const openSplitDetailView = (rowDetail: IVendor) => {
    setSecondPanelComponent(
      <VendorsDetailSplitView
        closeSecondPanel={closeSecondPanel}
        vendorsDetail={rowDetail}
      />,
    );
  };

  const columns: ColumnDef<IVendor>[] = [
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="lowercase cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('status')}</div>
      ),
    },
    {
      accessorKey: 'projectName',
      header: () => <div className="text-right">Project Name</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue('projectName')}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center">Actions</div>,
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex justify-center">
                <Button variant="ghost" className="h-4 w-4 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                onClick={() => openSplitDetailView(row.original)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssign(row.original)}>
                Assign Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
