import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useVendorsBeneficiaryTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (beneficiaryId: string) => {
    router.push(`/projects/aa/${id}/beneficiary/${beneficiaryId}`);
  };

  const { clickToCopy, copyAction } = useCopy();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row.getValue('name') || 'N/A'}</div>,
    },
    {
      accessorKey: 'benTokens',
      header: 'Tokens',
      cell: ({ row }) => <div>{row.getValue('benTokens') || 'N/A'}</div>,
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
                clickToCopy(row?.getValue('walletAddress'), row?.original?.uuid)
              }
            >
              <p>{truncateEthAddress(row?.getValue('walletAddress'))}</p>
              {copyAction === row?.original?.uuid ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {copyAction === row?.original?.uuid
                  ? 'copied'
                  : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
