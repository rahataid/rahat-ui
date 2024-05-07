'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import TriggerStatementsDetail from './trigger-statements.detail.view';

export const useTriggerStatementTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        return row.getValue('title')
      },
    },
    {
      accessorKey: 'dataSource',
      header: 'Data Source',
      cell: ({ row }) => {
        if (row.getValue('dataSource') === 'DHM') {
          return (
            <>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>DHM</TooltipTrigger>
                  <TooltipContent className="bg-secondary ">
                    <p className="text-xs font-medium">
                      Department of Hydrology and Meteorology
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          );
        }
        return row.getValue('dataSource')
      },
    },
    {
      accessorKey: 'location',
      header: 'River Basin',
      cell: ({ row }) => (
        <div className="cursor-pointer w-max">{row.getValue('location') || 'N/A'}</div>
      ),
    },
    // {
    //   accessorKey: 'triggerActivity',
    //   header: 'Trigger Activity',
    //   cell: ({ row }) => {
    //     const triggerActivities = row.getValue('triggerActivity');

    //     if (Array.isArray(triggerActivities) && triggerActivities.length) {
    //       return (
    //         <>
    //           {triggerActivities.map((activity, index) => (
    //             <div key={index}>{activity}</div>
    //           ))}
    //         </>
    //       );
    //     } else {
    //       return <div>N/A</div>;
    //     }
    //   }
    // },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className='flex gap-4 w-max'>
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() => {
                setSecondPanelComponent(
                  <TriggerStatementsDetail
                    triggerStatement={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />,
                );
              }}
            />
            <Pencil
              size={20}
              strokeWidth={1.5}
              className='text-primary'
            />
            <Trash2
              size={20}
              strokeWidth={1.5}
              color='red'
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
