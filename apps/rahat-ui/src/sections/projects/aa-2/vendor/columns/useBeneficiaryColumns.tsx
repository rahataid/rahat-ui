import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Pagination } from '@rumsan/sdk/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { PaginationTableName } from 'apps/rahat-ui/src/constants/pagination.table.name';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage.dynamic';
import { formatTokenAmount } from 'apps/rahat-ui/src/utils/stellar';
import { PayoutMode } from 'libs/query/src/lib/aa';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

type VendorBeneficiaryRow = {
  walletAddress: string;
  benTokens?: string;
  txHash?: string;
  amountDisbursed?: string;
  syncStatus?: string;
  status?: string;
  uuid: string;
};

export const useVendorsBeneficiaryTableColumns = (
  mode: PayoutMode,
  pagination: Pagination,
) => {
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const { id, vendorId }: { id: string; vendorId: string } = useParams();
  const router = useRouter();

  const params = useSearchParams();
  const tab = params.get('tab') as string;
  const subTab = params.get('subTab') as string;

  const handleViewClick = (beneficiaryId: string) => {
    setPaginationToLocalStorage(
      mode === PayoutMode.ONLINE
        ? PaginationTableName.VENDOR_ONLINE_BENEFICIARY_LIST
        : PaginationTableName.VENDOR_OFFLINE_BENEFICIARY_LIST,
    );
    router.push(
      `/projects/aa/${id}/beneficiary/${beneficiaryId}?vendorId=${vendorId}&tab=${tab}&subTab=${subTab}#pagination=${encodeURIComponent(
        JSON.stringify(pagination),
      )}`,
    );
  };

  const { clickToCopy, copyAction } = useCopy();
  const columns: ColumnDef<VendorBeneficiaryRow>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => {
        if (!row.original?.walletAddress) {
          return <div>N/A</div>;
        }
        return (
          <div className="flex flex-row">
            <TruncatedCell
              text={row.original?.walletAddress}
              maxLength={10}
              className="w-20 text-400 text-[#475263] text-[14px] leading-[16px] font-normal"
            />

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    clickToCopy(
                      row.original?.walletAddress,
                      row.original?.walletAddress,
                    )
                  }
                >
                  {copyAction === row.original?.walletAddress ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-slate-500"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className=" rounded-sm" side="bottom">
                  <p className="text-xs font-medium">
                    {copyAction === row.original?.walletAddress
                      ? 'copied'
                      : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: 'benTokens',
      header: 'Token Amount',
      cell: ({ row }) => {
        return row.getValue('benTokens') ? (
          <TruncatedCell
            text={`Rs. ${formatTokenAmount(
              row.getValue('benTokens'),
              settings,
              id,
            )}`}
            maxLength={20}
          />
        ) : (
          'N/A'
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => {
        const txHash = row?.original?.txHash as string;

        if (!txHash) return <div>N/A</div>;
        const txnUrl = getExplorerUrl({
          chainSettings: settings?.[id]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
          target: 'tx',
          value: txHash,
        });
        return (
          <div className="flex flex-row">
            <div className="w-20 truncate">
              <a
                href={txnUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer  text-[14px] leading-[16px] font-normal !text-[#297AD6]"
              >
                <TruncatedCell text={row.getValue('txHash')} maxLength={10} />
              </a>
            </div>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() =>
                    clickToCopy(row.getValue('txHash'), row.getValue('txHash'))
                  }
                >
                  {copyAction === row.getValue('txHash') ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-slate-500"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className=" rounded-sm" side="bottom">
                  <p className="text-xs font-medium">
                    {copyAction === row.getValue('txHash')
                      ? 'copied'
                      : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: 'amountDisbursed',
      header: 'Amount Disbursed',
      cell: ({ row }) => {
        const status = row.original?.status;
        return status === 'COMPLETED' ? (
          row.getValue('benTokens') ? (
            <TruncatedCell
              text={`Rs. ${row.getValue('benTokens')}`}
              maxLength={20}
            />
          ) : (
            'N/A'
          )
        ) : (
          'Rs. 0'
        );
      },
    },
    ...(mode === PayoutMode.OFFLINE
      ? [
          {
            accessorKey: 'syncStatus',
            header: 'Sync Status',
            cell: ({ row }: { row: Row<VendorBeneficiaryRow> }) => {
              const status = row.original?.status;
              return (
                <Badge
                  className="text-xs font-normal"
                  style={{
                    backgroundColor:
                      status === 'PENDING' ? '#F2F4F7' : '#ECFDF3',
                    color: status === 'PENDING' ? '#344054' : '#027A48',
                  }}
                >
                  {status === 'PENDING' ? 'Pending' : 'Synced'}
                </Badge>
              );
            },
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
              row.original?.status === 'COMPLETED' ? '#ECFDF3' : '#F2F4F7',
            color: row.original?.status === 'COMPLETED' ? '#027A48' : '#344054',
          }}
        >
          {row.original?.status === 'COMPLETED' ? 'Redeemed' : 'Pending'}
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
