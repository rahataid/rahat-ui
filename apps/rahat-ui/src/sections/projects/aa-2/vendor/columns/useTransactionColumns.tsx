import {
  PROJECT_SETTINGS_KEYS,
  TOKEN_TO_AMOUNT_MULTIPLIER,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { formatEnumString } from 'apps/rahat-ui/src/utils/string';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';

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
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const columns: ColumnDef<VendorTransactionRow>[] = [
    {
      accessorKey: 'topic',
      header: tg('TOPIC'),
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.original?.transactionType
              ? formatEnumString(row.original?.transactionType)
              : tg('N_A')
          }
        />
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: t('BENEFICIARY_WALLET_ADDRESS'),
      cell: ({ row }) => {
        if (!row.original?.beneficiaryWalletAddress) {
          return <div>{t('N_A')}</div>;
        }
        return (
          <div className="flex flex-row">
            <TruncatedCell
              text={row.original?.beneficiaryWalletAddress}
              maxLength={10}
              className="w-20"
            />
            <CopyTooltip
              value={row.original?.beneficiaryWalletAddress}
              uniqueKey={row.original?.beneficiaryWalletAddress}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: t('AMOUNT_DISBURSED'),
      cell: ({ row }) => {
        const amountNum = Number(row.original?.amount) || 0;
        const convertedAmount = amountNum * TOKEN_TO_AMOUNT_MULTIPLIER;

        return (
          <TruncatedCell
            text={
              amountNum > 0
                ? `${t('RS')} ${formatNum(
                    Math.round(convertedAmount),
                  )}`
                : tg('N_A')
            }
          />
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: t('TX_HASH'),
      cell: ({ row }) => {
        if (!row.original?.txHash) {
          return <div>{t('N_A')}</div>;
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
            <CopyTooltip
              value={row.original?.txHash}
              uniqueKey={row.original?.txHash}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: tg('STATUS'),
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
          {row.original?.info?.mode === 'OFFLINE' ? t('OFFLINE') : t('ONLINE')}
        </Badge>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: tg('TIMESTAMP'),
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row?.original?.updatedAt ? formatDate(row?.original?.updatedAt) : ''
          }
          maxLength={30}
        />
      ),
    },
  ];
  return columns;
};
