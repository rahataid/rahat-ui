import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Import } from '@rahataid/sdk/clients';

export const useImportListTableColumns = () => {
  const columns: ColumnDef<Import>[] = [
    {
      header: 'Group Name',
      accessorKey: 'groupName',
      cell: ({ row }) => <div>{row.getValue('groupName')}</div>,
    },
    {
      header: 'Beneficiary Count',
      accessorKey: 'beneficiaryCount',
      cell: ({ row }) => <div>{row.getValue('beneficiaryCount')}</div>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'IMPORTED'
                ? 'bg-green-100 text-green-800'
                : status === 'PROCESSING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : status === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
            }`}
          >
            {status}
          </div>
        );
      },
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt');
        const formatDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kathmandu',
        }).format(new Date(createdAt as string));
        return <div>{formatDate}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      accessorKey: 'uuid',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 items-center">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    href={`/import-beneficiary/${row.original.uuid}?name=${row.getValue('groupName')}&count=${row.getValue('beneficiaryCount')}&date=${row.getValue('createdAt')}`}
                  >
                    <Eye size={18} strokeWidth={2} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  <p className="text-xs font-medium">View Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
  return columns;
};
