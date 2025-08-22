import {
  TOKEN_TO_AMOUNT_MULTIPLIER,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { getStellarTxUrl } from 'apps/rahat-ui/src/utils/stellar';
import { formatEnumString } from 'apps/rahat-ui/src/utils/string';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';

export const useVendorsTransactionTableColumns = () => {
  const { id } = useParams();
  const projectId = id as string;
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => (
        <div>
          {row.original?.transactionType
            ? formatEnumString(row.original?.transactionType)
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => {
        if (!row.original?.beneficiaryWalletAddress) {
          return <div>N/A</div>;
        }
        return (
          <div className="flex flex-row">
            <div className="w-20 truncate text-[14px] leading-[16px] font-normal !text-[#475263]">
              {row.original?.beneficiaryWalletAddress}
            </div>
            <button
              onClick={() =>
                clickToCopy(
                  row.original?.beneficiaryWalletAddress,
                  row.original?.beneficiaryWalletAddress,
                )
              }
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === row.original?.beneficiaryWalletAddress ? (
                <CopyCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount Disbursed',
      cell: ({ row }) => {
        const amountNum = Number(row.original?.amount) || 0;
        const convertedAmount = amountNum * TOKEN_TO_AMOUNT_MULTIPLIER;

        return (
          <div>
            {amountNum > 0
              ? `Rs. ${Intl.NumberFormat('en-IN').format(
                  Math.round(convertedAmount),
                )}`
              : 'N/A'}
          </div>
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => {
        if (!row.original?.txHash) {
          return <div>N/A</div>;
        }
        return (
          <div className="flex flex-row">
            <div className="w-20 truncate">
              <a
                href={getStellarTxUrl(
                  settings,
                  projectId,
                  row?.original?.txHash,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer "
              >
                {row.getValue('txHash')}
              </a>
            </div>
            <button
              onClick={() =>
                clickToCopy(row.getValue('txHash'), row.getValue('txHash'))
              }
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === row.getValue('txHash') ? (
                <CopyCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.fspId === null ? '#ECFDF3' : '#F2F4F7', //#F2F4F7',
            color: row.original?.fspId === null ? '#027A48' : '#344054', //#344054',
          }}
        >
          {row.original?.fspId === null ? 'Online' : 'Offline'}
        </Badge>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div>
          {row?.original?.createdAt ? dateFormat(row?.original?.createdAt) : ''}
        </div>
      ),
    },
  ];
  return columns;
};
