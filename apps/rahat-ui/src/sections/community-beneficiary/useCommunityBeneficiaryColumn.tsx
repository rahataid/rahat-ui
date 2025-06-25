import { useTempBeneficiaryImport } from '@rahat-ui/query';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { ColumnDef } from '@tanstack/react-table';
import {
  CloudDownload,
  CloudDownloadIcon,
  Copy,
  CopyCheck,
  Eye,
  Import,
} from 'lucide-react';
import Link from 'next/link';
import { humanReadableDate, humanizeString } from '../../utils';
import { TempBeneficiary } from '@rahataid/sdk';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import useCopy from '../../hooks/useCopy';
import { UUID } from 'crypto';
import { truncateEthAddress } from '@rumsan/sdk/utils';
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

export const useCommunityBeneficiaryGroupTableColumns = () => {
  const importTempBeneficiaries = useTempBeneficiaryImport();
  const router = useRouter();
  const handleImportBeneficiaries = async (args: string) => {
    const res = await importTempBeneficiaries.mutateAsync({
      groupUUID: args,
    });
    if (res?.response?.success) {
      setTimeout(() => {
        router.push('/beneficiary');
      }, 1500);
    }
  };
  const columns: ColumnDef<TempBeneficiary>[] = [
    {
      header: 'Group Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },

    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        const createAt = row.getValue('createdAt');
        const formatDate = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kathmandu',
        }).format(new Date(createAt as Date));

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
                    href={`/community-beneficiary/${
                      row.original.uuid
                    }?name=${row.getValue('name')}&date=${row.getValue(
                      'createdAt',
                    )}`}
                  >
                    <Eye size={18} strokeWidth={2} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  <p className="text-xs font-medium">View Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <CloudDownload
                  size={18}
                  strokeWidth={2}
                  className="hover:cursor-pointer"
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader className="mx-auto">
                  <AlertDialogTitle className="flex flex-col  items-center justify-center">
                    <div className="rounded-full p-2 bg-blue-100">
                      <CloudDownloadIcon className="w-6 h-6" color="blue" />
                    </div>
                    <div>Import Beneficiary Group</div>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to import this beneficiary group to
                    Rahat?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="w-full">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    onClick={() =>
                      handleImportBeneficiaries(row.original.uuid as string)
                    }
                    className="w-full"
                  >
                    Import
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  return columns;
};

export const useCommunityBeneficiaryTableColumns = () => {
  const { clickToCopy, copyAction } = useCopy();
  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      header: 'Beneficiary Name',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(
                  row?.original?.walletAddress as string,
                  row?.original?.id as number,
                )
              }
            >
              <p className=" truncate w-48">
                {row?.original?.walletAddress as string}
              </p>
              {copyAction === row?.original?.id ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {copyAction === row?.original?.id ? 'copied' : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{humanizeString(row.getValue('phone'))}</div>,
    },

    {
      accessorKey: 'govtIDNumber',
      header: 'Govt. ID Number',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('govtIDNumber')) || '-'}</div>
      ),
    },
  ];

  return columns;
};
