import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle, Download, Eye, Loader2, Play } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Import } from '@rahataid/sdk/clients';
import {
  useDownloadImportErrors,
  useImportProgress,
  useStartImport,
} from '@rahat-ui/query';
import { toast } from 'react-toastify';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { useEffect } from 'react';

function ImportActionCell({ row }: { row: any }) {
  const status = row.getValue('status') as string;
  const uuid = row.original.uuid;
  const groupName = row.getValue('groupName') as string;

  const startImport = useStartImport();
  const { progress, isListening, startListening } = useImportProgress(uuid);
  const downloadErrors = useDownloadImportErrors();

  const handleStartImport = async () => {
    try {
      await startImport.mutateAsync(uuid);
      toast.success('Import started');
      startListening();
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

  const currentStatus = progress?.status || status;
  const isProcessing =
    currentStatus === 'PROCESSING' || startImport.isPending || isListening;

  return (
    <div className="flex gap-2 items-center">
      {currentStatus === 'NEW' && !isProcessing && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleStartImport}
                disabled={startImport.isPending}
              >
                {startImport.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Play size={18} strokeWidth={2} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              <p className="text-xs font-medium">Start Import</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {isProcessing && progress && (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress
            value={
              progress.total > 0
                ? (progress.processed / progress.total) * 100
                : 0
            }
            className="h-2 w-20"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {progress.processed}/{progress.total}
          </span>
        </div>
      )}

      {isProcessing && !progress && (
        <div className="flex items-center gap-1">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs text-muted-foreground">Processing...</span>
        </div>
      )}

      {(currentStatus === 'FAILED' || (progress && progress.failed > 0)) && (
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
  const uuid = row.original.uuid;
  const { progress } = useImportProgress(uuid);
  const currentStatus = progress?.status || status;

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        currentStatus === 'IMPORTED'
          ? 'bg-green-100 text-green-800'
          : currentStatus === 'PROCESSING'
            ? 'bg-yellow-100 text-yellow-800'
            : currentStatus === 'FAILED'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
      }`}
    >
      {currentStatus}
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
