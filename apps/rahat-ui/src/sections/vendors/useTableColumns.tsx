'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye, FolderPlus } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import VendorsDetailSplitView from './vendors.detail.split.view';
import { IVendor } from './vendors.list.table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import TooltipComponent from '../../components/tooltip';

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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div
          className="cursor-pointer capitalize"
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
        <Badge className="capitalize">{row.getValue('status')}</Badge>
      ),
    },
    {
      accessorKey: 'projectName',
      header: 'Project Name',
      cell: ({ row }) => {
        return (
          <div className="font-medium flex flex-col">
            {row.original.projectName?.map((name: any, index: number) => (
              <Badge key={index} className="w-fit mb-2 rounded-md">
                {name}
              </Badge>
            ))}
          </div>
        );
      },
    },

    {
      header: 'Actions',
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-3 items-center">
            <TooltipComponent
              handleOnClick={() => openSplitDetailView(row.original)}
              Icon={Eye}
              tip="View"
            />
            <TooltipComponent
              handleOnClick={() => handleAssign(row.original)}
              Icon={FolderPlus}
              tip="Assign Project"
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
