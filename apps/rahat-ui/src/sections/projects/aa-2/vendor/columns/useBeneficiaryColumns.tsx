import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Pagination } from '@rumsan/sdk/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { PaginationTableName } from 'apps/rahat-ui/src/constants/pagination.table.name';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage.dynamic';
import { formatTokenAmount } from 'apps/rahat-ui/src/utils/stellar';
import { PayoutMode } from 'libs/query/src/lib/aa';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';

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
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
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

  const columns: ColumnDef<VendorBeneficiaryRow>[] = [
    {
      accessorKey: 'walletAddress',
      header: tg('WALLET_ADDRESS'),
      cell: ({ row }) => {
        if (!row.original?.walletAddress) {
          return <div>{tg('N_A')}</div>;
        }
        return (
          <div className="flex flex-row">
            <TruncatedCell
              text={row.original?.walletAddress}
              maxLength={10}
              className="w-20 text-400 text-[#475263] text-[14px] leading-[16px] font-normal"
            />
            <CopyTooltip
              value={row.original?.walletAddress}
              uniqueKey={row.original?.uuid}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'benTokens',
      header: t('TOKEN_AMOUNT'),
      cell: ({ row }) => {
        return row.getValue('benTokens') ? (
          <TruncatedCell
            text={`${formatTokenAmount(
              row.getValue('benTokens'),
              settings,
              id,
            )}`}
          />
        ) : (
          tg('N_A')
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: t('TX_HASH'),
      cell: ({ row }) => {
        const txHash = row?.original?.txHash as string;

        if (!txHash) return <div>{tg('N_A')}</div>;
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
            <CopyTooltip
              value={row.getValue('txHash')}
              uniqueKey={row.original?.uuid}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'amountDisbursed',
      header: t('AMOUNT_DISBURSED'),
      cell: ({ row }) => {
        const status = row.original?.status;
        return status === 'COMPLETED' ? (
          row.getValue('benTokens') ? (
            <TruncatedCell text={`${t('RS')} ${formatNum(row.getValue('benTokens'))}`} />
          ) : (
            tg('N_A')
          )
        ) : (
          `${t('RS')} ${formatNum(0)}`
        );
      },
    },
    ...(mode === PayoutMode.OFFLINE
      ? [
          {
            accessorKey: 'syncStatus',
            header: t('SYNC_STATUS'),
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
                  {status === 'PENDING' ? t('PENDING') : t('SYNCED')}
                </Badge>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: 'status',
      header: t('TOKEN_STATUS'),
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.status === 'COMPLETED' ? '#ECFDF3' : '#F2F4F7',
            color: row.original?.status === 'COMPLETED' ? '#027A48' : '#344054',
          }}
        >
          {row.original?.status === 'COMPLETED' ? t('REDEEMED') : t('PENDING')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
