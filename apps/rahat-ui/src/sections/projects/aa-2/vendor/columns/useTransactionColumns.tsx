import {
  PROJECT_SETTINGS_KEYS,
  TOKEN_TO_AMOUNT_MULTIPLIER,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { formatEnumString } from 'apps/rahat-ui/src/utils/string';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';

type VendorTransactionRow = {
  transactionType?: string;
  beneficiaryWalletAddress: string;
  amount?: number | string;
  txHash?: string;
  info?: {
    mode?: 'OFFLINE' | 'ONLINE' | string;
  };
  updatedAt?: string;
};

export const useVendorsTransactionTableColumns = () => {
  const { id } = useParams();
  const projectId = id as string;
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<VendorTransactionRow>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.original?.transactionType
              ? formatEnumString(row.original?.transactionType)
              : 'N/A'
          }
          maxLength={20}
        />
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
            <TruncatedCell
              text={row.original?.beneficiaryWalletAddress}
              maxLength={10}
              className="w-20"
            />
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
          <TruncatedCell
            text={
              amountNum > 0
                ? `Rs. ${Intl.NumberFormat('en-IN').format(
                    Math.round(convertedAmount),
                  )}`
                : 'N/A'
            }
            maxLength={20}
          />
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
                href={
                  getExplorerUrl({
                    chainSettings:
                      settings?.[projectId]?.[
                        PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS
                      ],
                    target: 'tx',
                    value: row.original?.txHash,
                  }) || '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer "
              >
                <TruncatedCell text={row.getValue('txHash')} maxLength={10} />
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
              row.original?.info?.mode === 'OFFLINE' ? '#F2F4F7' : '#ECFDF3',
            color:
              row.original?.info?.mode === 'OFFLINE' ? '#344054' : '#027A48',
          }}
        >
          {row.original?.info?.mode === 'OFFLINE' ? 'Offline' : 'Online'}
        </Badge>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row?.original?.updatedAt ? dateFormat(row?.original?.updatedAt) : ''
          }
          maxLength={30}
        />
      ),
    },
  ];
  return columns;
};
