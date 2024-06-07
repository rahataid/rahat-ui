import { useParams, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useTriggerStatementTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        return row.getValue('title');
      },
    },
    {
      accessorKey: 'dataSource',
      header: 'Data Source',
      cell: ({ row }) => {
        console.log(row.original);

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
        return row.getValue('dataSource');
      },
    },
    {
      accessorKey: 'location',
      header: 'River Basin',
      cell: ({ row }) => (
        <div className="cursor-pointer w-max">
          {row.getValue('location') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'phase',
      header: 'Phase',
      cell: ({ row }) => (
        <div className="cursor-pointer w-max">
          {row.original?.phase?.name || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'isTriggered',
      header: 'Status',
      cell: ({ row }) => {
        const isTriggered = row.getValue('isTriggered');
        return (
          <Badge
            className={
              !isTriggered
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }
          >
            {isTriggered ? 'Triggered' : 'Not Triggered'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'triggeredAt',
      header: 'Triggered At',
      cell: ({ row }) => {
        const triggeredAt = row.getValue('triggeredAt') as string;
        console.log("triggered at", triggeredAt)
        if(triggeredAt){
          const d =  new Date(triggeredAt)
          const localeDate = d.toLocaleDateString()
          const localeTime = d.toLocaleTimeString()
          return `${localeDate} ${localeTime}`
        }
        return 'N/A'
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 w-max">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/trigger-statements/${row.original.repeatKey}`,
                )
              }
            />
            {/* <Pencil size={20} strokeWidth={1.5} className="text-primary" />
            <Trash2 size={20} strokeWidth={1.5} color="red" /> */}
          </div>
        );
      },
    },
  ];

  return columns;
};
