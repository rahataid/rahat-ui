import { useTempBeneficiaryImport } from '@rahat-ui/query';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Import } from 'lucide-react';
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
        return <div>{humanReadableDate(row.getValue('createdAt'))}</div>;
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
                  <Link href={`/community-beneficiary/${row.original.uuid}`}>
                    <Eye
                      size={20}
                      strokeWidth={1.5}
                      className="bg-transparent hover:bg-blue-500 text-blue-700  hover:text-white p-1  border border-blue-500 hover:border-transparent rounded w-6 h-6"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  <p className="text-xs font-medium">View Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() =>
                    handleImportBeneficiaries(row.original.uuid as string)
                  }
                >
                  <Import
                    className="bg-transparent hover:bg-blue-500 text-blue-700  hover:text-white p-1  border border-blue-500 hover:border-transparent rounded w-6 h-6"
                    size={40}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                  <p className="text-xs font-medium">Import</p>
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

export const useCommunityBeneficiaryTableColumns = () => {
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
