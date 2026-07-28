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
import { useTranslations } from 'next-intl';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

function ImportActionCell({ row }: { row: any }) {
  const t = useTranslations('Import Beneficiary List');
  const tg = useTranslations('GLOBAL');
  const status = row.getValue('status') as string;
  const uuid = row.original.uuid;
  const groupName = row.getValue('groupName') as string;
  const beneficiaryCount = row.getValue('beneficiaryCount') as number;

  const startImport = useStartImport();
  const downloadErrors = useDownloadImportErrors();

  const handleStartImport = async () => {
    try {
      await startImport.mutateAsync(uuid);
      toast.success(t('IMPORT_HAS_STARTED'));
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
                <p className="text-xs font-medium">{t('START_IMPORT')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('CONFIRM_IMPORT')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('REVIEW_THE_DETAILS_BELOW_BEFORE_STARTING')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="rounded-md border p-3 space-y-2 text-sm my-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tg('GROUP_NAME')}</span>
                <span className="font-medium">{groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('BENEFICIARIES_TO_IMPORT')}</span>
                <span className="font-medium">{beneficiaryCount}</span>
              </div>
            </div>
            <div className="flex gap-2 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-yellow-600" />
              <p>
                {t('IF_THIS_GROUP_IS_ASSIGNED_TO')}
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>{tg('CANCEL')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleStartImport}>
                {t('START_IMPORT')}
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
              <p className="text-xs font-medium">{t('DOWNLOAD_ERROR_REPORT')}</p>
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
            <p className="text-xs font-medium">{tg('VIEW_DETAILS')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function StatusCell({ row }: { row: any }) {
  const tg = useTranslations('GLOBAL');
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
      {tg.has(status as never) ? tg(status as never) : status}
      </div>
  );
}

function CreatedAtCell({ row }: { row: any }) {
  const formatDate = useDateFormat();
  return <div>{formatDate(row.getValue('createdAt'), 'MMM d, yyyy, h:mm a')}</div>;
}

function BeneficiaryCountCell({ row }: { row: any }) {
  const formatNum = useNumberFormat();
  return <div>{formatNum(row.getValue('beneficiaryCount'))}</div>;
}

export const useImportListTableColumns = () => {
  const t = useTranslations('Import Beneficiary List');
  const tg = useTranslations('GLOBAL');
  const columns: ColumnDef<Import>[] = [
    {
      header: tg('GROUP_NAME'),
      accessorKey: 'groupName',
      cell: ({ row }) => <div>{row.getValue('groupName')}</div>,
    },
    {
      header: t('BENEFICIARY_COUNT'),
      accessorKey: 'beneficiaryCount',
      cell: ({ row }) => <BeneficiaryCountCell row={row} />,
    },
    {
      header: tg('STATUS'),
      accessorKey: 'status',
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      header: tg('CREATED_AT'),
      accessorKey: 'createdAt',
      cell: ({ row }) => <CreatedAtCell row={row} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      accessorKey: 'uuid',
      header: tg('ACTIONS'),
      cell: ({ row }) => <ImportActionCell row={row} />,
    },
  ];
  return columns;
};
