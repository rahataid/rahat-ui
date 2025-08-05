import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'apps/rahat-ui/src/common/badge';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { truncateAddress } from 'apps/rahat-ui/src/utils/string';
import { PayoutMode } from 'libs/query/src/lib/aa';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export const useVendorsBeneficiaryTableColumns = (mode: PayoutMode) => {
  const { id, vendorId } = useParams();
  const router = useRouter();

  const params = useSearchParams();
  const tab = params.get('tab') as string;
  const subTab = params.get('subTab') as string;
  const perPage = params.get('perPage') as string;
  const page = params.get('page') as string;

  const handleViewClick = (beneficiaryId: string) => {
    router.push(
      `/projects/aa/${id}/beneficiary/${beneficiaryId}?vendorId=${vendorId}&tab=${tab}&subTab=${subTab}&perPage=${perPage}&page=${page}`,
    );
  };

  const { clickToCopy, copyAction } = useCopy();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => {
        if (!row?.getValue('walletAddress')) return <div>N/A</div>;
        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  clickToCopy(
                    row?.getValue('walletAddress'),
                    row?.original?.uuid,
                  )
                }
              >
                <p>{truncateAddress(row?.getValue('walletAddress'))}</p>
                {copyAction === row?.original?.uuid ? (
                  <CopyCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Copy
                    className="text-slate-500"
                    size={15}
                    strokeWidth={1.5}
                  />
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
        );
      },
    },
    {
      accessorKey: 'benTokens',
      header: 'Token',
      cell: ({ row }) => <div>{row.getValue('benTokens') || 'N/A'}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => {
        const txHash = row?.getValue('txHash') as string;
        const uuid = row?.original?.uuid as number;

        if (!txHash) return <div>N/A</div>;

        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => clickToCopy(txHash, uuid)}
              >
                <p>{truncateAddress(txHash)}</p>
                {copyAction === uuid ? (
                  <CopyCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Copy
                    className="text-slate-500"
                    size={15}
                    strokeWidth={1.5}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-secondary" side="bottom">
                <p className="text-xs font-medium">
                  {copyAction === uuid ? 'copied' : 'click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'amountDisbursed',
      header: 'Amount Disbursed',
      cell: ({ row }) => (
        <div>
          {row.getValue('benTokens')
            ? `Rs. ${row.getValue('benTokens')}`
            : 'N/A'}
        </div>
      ),
    },
    ...(mode === PayoutMode.OFFLINE
      ? [
          {
            accessorKey: 'syncStatus',
            header: 'Sync Status',
            cell: ({ row }) => (
              <Badge
                type={
                  row.original?.syncStatus === 'SYNCED' ? 'primary' : 'warning'
                }
                label={
                  row.original?.syncStatus === 'SYNCED' ? 'Synced' : 'Pending'
                }
              />
            ),
          },
        ]
      : []),
    {
      accessorKey: 'tokenStatus',
      header: 'Token Status',
      cell: ({ row }) => (
        <Badge
          type={
            row.original?.tokenStatus === 'REDEEMED' ? 'primary' : 'warning'
          }
          label={
            row.original?.tokenStatus === 'REDEEMED' ? 'Redeemed' : 'Pending'
          }
        />
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
