'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import EditSettings from 'apps/rahat-ui/src/sections/settings/edit.settings';

interface SettingData {
  name: string;
  dataType: string;
  isPrivate: boolean;
  isReadOnly: boolean;
  requiredFields: string[];
  value: any;
}

export const useAASettingColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<SettingData>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      header: 'DataType',
      accessorKey: 'dataType',
      cell: ({ row }) => <div>{row.getValue('dataType')}</div>,
    },
    {
      header: 'Is Private',
      accessorKey: 'isPrivate',
      cell: ({ row }) => <div>{row.original.isPrivate ? 'Yes' : 'No'}</div>,
    },
    {
      header: 'Is ReadOnly',
      accessorKey: 'isReadOnly',
      cell: ({ row }) => <div>{row.original.isReadOnly ? 'Yes' : 'No'}</div>,
    },
    {
      header: 'Required Fields',
      accessorKey: 'requiredFields',
      cell: ({ row }) => (
        <div>
          {row.original.requiredFields?.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Edit
                size={20}
                strokeWidth={1.5}
                className="cursor-pointer hover:text-primary"
                onClick={() =>
                  setSecondPanelComponent(
                    <EditSettings
                      closeSecondPanel={closeSecondPanel}
                      settingData={row.original}
                    />,
                  )
                }
              />
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  return columns;
};
