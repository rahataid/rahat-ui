import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Copy, CopyCheck } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { amountFormat, PROJECT_SETTINGS_KEYS, useProjectSettingsStore } from '@rahat-ui/query';
import { formatEther, formatUnits } from 'viem';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useReadRahatTokenDecimals } from 'apps/rahat-ui/src/hooks/c2c/contracts/rahatToken';

const useTransactionHistoryTableColumns = () => {
  const { id: projectUUID } = useParams() as {
      id: UUID;
      disbursementId: UUID;
    };
  const { clickToCopy, copyAction } = useCopy();

   const contractSettings = useProjectSettingsStore(
      (state) => state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
    );

    const {data:tokenNumber} = useReadRahatTokenDecimals({address:contractSettings?.rahattoken?.address})
  

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <span>Disbursed</span>,
    },
    {
      accessorKey: '_to',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row?.original?._to, row?.original?._to)
              }
            >
              <p>{truncateEthAddress(row?.original?._to)}</p>
              {copyAction === row?.original?._to ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {copyAction === row?.original?._to ? 'copied' : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: 'Transaction Hash',
      cell: ({ row }) => (
        <a
          href={`${process.env.NEXT_PUBLIC_BASESCAN_URL}/tx/${row.original.transactionHash}`}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          {truncateEthAddress(row.original.transactionHash)}
        </a>
      ),
    },
    {
      accessorKey: '_amount',
      header: 'Disburse Amount',
      cell: ({ row }) => {
        return (
          <span>{amountFormat(formatUnits(row.original._amount,Number(tokenNumber)))} USDC</span>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <p>{dateFormat(row.original.date)}</p>,
    },
  ];
  return columns;
};

export default useTransactionHistoryTableColumns;
