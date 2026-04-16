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
        const projects = row.getValue('projectName');

        if (!Array.isArray(projects) || projects.length === 0) {
          return <span className="text-gray-400 text-sm">NA</span>;
        }

        const visibleProjects = projects.slice(0, 2);
        const remainingCount = projects.length - 2;

        return (
          <div className="flex flex-wrap gap-1.5 max-w-[250px]">
            {visibleProjects.map((item, index) => (
              <Badge
                key={item?.Project?.id || index}
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium"
              >
                {item?.Project?.name || 'NA'}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full font-medium">
                +{remainingCount} more
              </Badge>
            )}
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
