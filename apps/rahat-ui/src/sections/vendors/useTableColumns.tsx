'use client';

import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FolderPlus } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import VendorsDetailSplitView from './vendors.detail.split.view';
import { IVendor } from './vendors.list.table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import TooltipComponent from '../../components/tooltip';
import { useState } from 'react';

const ProjectNameCell = ({
  projects,
  labels,
}: {
  projects: any;
  labels: { na: string; showLess: string; more: string };
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!Array.isArray(projects) || projects.length === 0) {
    return <span className="text-gray-400 text-sm">{labels.na}</span>;
  }

  const visibleProjects = showAll ? projects : projects.slice(0, 2);
  const remainingCount = projects.length - 2;

  return (
    <div className="flex flex-wrap gap-1.5 max-w-[250px]">
      {visibleProjects.map((item, index) => (
        <Badge
          key={item?.Project?.id || index}
          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 border border-blue-200 rounded-full font-medium"
        >
          {item?.Project?.name || labels.na}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full font-medium cursor-pointer hover:bg-gray-200 transition-colors"
        >
          {showAll ? labels.showLess : `+${remainingCount} ${labels.more}`}
        </Badge>
      )}
    </div>
  );
};

export const useTableColumns = (handleAssignClick: any) => {
  const t = useTranslations('VENDORS_LIST');
  const g = useTranslations('GLOBAL');
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
      header: g('NAME'),
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
      header: g('STATUS'),
      filterFn: (row, _columnId, filterValue) => {
        if (!filterValue) return true;
        const status = row.getValue('status') as string;
        return status === filterValue;
      },
      cell: ({ row }) => (
        <Badge className="capitalize">
          {(() => {
            // Status arrives from the API as "Assigned" / "Pending"; resolve it
            // through GLOBAL and fall back to the raw value for unknown states.
            const s = row.getValue('status') as string;
            const key = String(s ?? '').toUpperCase();
            return g.has(key as never) ? g(key as never) : s;
          })()}
        </Badge>
      ),
    },
    {
      accessorKey: 'projectName',
      header: g('PROJECT_NAME'),
      filterFn: (row, _columnId, filterValue) => {
        if (!filterValue) return true;
        const projects = row.getValue('projectName');
        if (!Array.isArray(projects)) return false;
        return projects.some((item) => item?.Project?.name === filterValue);
      },
      cell: ({ row }) => (
        <ProjectNameCell
          projects={row.getValue('projectName')}
          labels={{ na: g('N_A'), showLess: t('SHOW_LESS'), more: t('MORE') }}
        />
      ),
    },

    {
      header: g('ACTIONS'),
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-3 items-center">
            <TooltipComponent
              handleOnClick={() => openSplitDetailView(row.original)}
              Icon={Eye}
              tip={g('VIEW')}
            />
            <TooltipComponent
              handleOnClick={() => handleAssign(row.original)}
              Icon={FolderPlus}
              tip={g('ASSIGN_PROJECT')}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
