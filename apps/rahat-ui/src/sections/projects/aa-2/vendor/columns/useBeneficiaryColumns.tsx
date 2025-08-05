import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { toTitleCase } from 'apps/rahat-ui/src/utils/string';
import { PayoutMode } from 'libs/query/src/lib/aa';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export const useVendorsBeneficiaryTableColumns = (mode: PayoutMode) => {
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { id, vendorId }: { id: string; vendorId: string } = useParams();
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
        if (!row.original?.walletAddress) {
          return <div>N/A</div>;
        }
        return (
          <div className="flex flex-row">
            <div className="w-20 truncate text-400 text-[#475263] text-[14px] leading-[16px] font-normal">
              {row.original?.walletAddress}
            </div>
            <button
              onClick={() =>
                clickToCopy(
                  row.original?.walletAddress,
                  row.original?.walletAddress,
                )
              }
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === row.original?.walletAddress ? (
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
      accessorKey: 'benTokens',
      header: 'Token Amount',
      cell: ({ row }) => (
        <div>
          {row.getValue('benTokens')
            ? `${row.getValue('benTokens')} ${
                settings?.[id]?.[PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]
                  ?.assetcode
              }`
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => {
        const txHash = row?.original?.txHash as string;

        if (!txHash) return <div>N/A</div>;

        return (
          <div className="flex flex-row">
            <div className="w-20 truncate">
              <a
                href={`https://stellar.expert/explorer/${
                  settings?.[id]?.[PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]?.[
                    'network'
                  ] === 'mainnet'
                    ? 'public'
                    : 'testnet'
                }/tx/${row?.original?.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer  text-[14px] leading-[16px] font-normal !text-[#297AD6]"
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
                className="text-xs font-normal"
                style={{
                  backgroundColor:
                    row.original?.syncStatus === 'SYNCED'
                      ? '#ECFDF3'
                      : '#ECFDF3', //#F2F4F7',
                  color:
                    row.original?.syncStatus === 'SYNCED'
                      ? '#027A48'
                      : '#027A48', //#344054',
                }}
              >
                {row.original?.syncStatus === 'SYNCED' ? 'Synced' : 'Pending'}
              </Badge>
            ),
          },
        ]
      : []),
    {
      accessorKey: 'status',
      header: 'Token Status',
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.status === 'COMPLETED' ? '#ECFDF3' : '#ECFDF3', //#F2F4F7',
            color: row.original?.status === 'COMPLETED' ? '#027A48' : '#027A48', //#344054',
          }}
        >
          {row.original?.status === 'COMPLETED'
            ? toTitleCase(row.original?.status)
            : 'N/A'}
        </Badge>
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
