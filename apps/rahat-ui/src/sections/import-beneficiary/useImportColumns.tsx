import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle, Eye, FolderDown } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Import } from '@rahataid/sdk/clients';
import {
  useDownloadImportErrors,
  useStartImport,
} from '@rahat-ui/query';
import { toast } from 'react-toastify';
import { Button } from '@rahat-ui/shadcn/components/button';

function ImportActionCell({ row }: { row: any }) {
  const status = row.getValue('status') as string;
  const uuid = row.original.uuid;
  const groupName = row.getValue('groupName') as string;
  const beneficiaryCount = row.getValue('beneficiaryCount') as number;

  const startImport = useStartImport();
  const downloadErrors = useDownloadImportErrors();

  const handleStartImport = async () => {
    try {
      await startImport.mutateAsync(uuid);
      toast.success('Import has started. Please reload the page to check the status.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to start import');
    }
  };

  const handleDownloadErrors = async () => {
    try {
      await downloadErrors(uuid, groupName);
    } catch {
      toast.error('Failed to download errors');
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {status === 'NEW' && (
        <AlertDialog>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={startImport.isPending}
                  >
                    <FolderDown size={18} strokeWidth={2} />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                <p className="text-xs font-medium">Start Import</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Import</AlertDialogTitle>
              <AlertDialogDescription>
                Review the details below before starting the import.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="rounded-md border p-3 space-y-2 text-sm my-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group Name</span>
                <span className="font-medium">{groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Beneficiaries to Import</span>
                <span className="font-medium">{beneficiaryCount}</span>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleStartImport}>
                Start Import
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {status === 'FAILED' && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={handleDownloadErrors}
              >
                <AlertCircle size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              <p className="text-xs font-medium">Download Error Report</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Link
              href={`/import-beneficiary/${uuid}?name=${row.getValue('groupName')}&count=${row.getValue('beneficiaryCount')}&date=${row.getValue('createdAt')}`}
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
}

function StatusCell({ row }: { row: any }) {
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
}

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
      cell: ({ row }) => <StatusCell row={row} />,
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
      cell: ({ row }) => <ImportActionCell row={row} />,
    },
  ];
  return columns;
};
