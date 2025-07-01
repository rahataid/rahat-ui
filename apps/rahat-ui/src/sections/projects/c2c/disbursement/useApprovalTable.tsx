import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { ColumnDef } from '@tanstack/react-table';
import { formatdbDate } from 'apps/rahat-ui/src/utils';
import { Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export type Disbursements = {
  owner: string;
  hasApproved: boolean;
  submissionDate: string;
};

export const useApprovalTable = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();
  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const columns: ColumnDef<Disbursements>[] = [
    // {
    //   accessorKey: 'owner',
    //   header: 'Owner',
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue('owner')}</div>
    //   ),
    // },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => clickToCopy(row.getValue('owner'), row.index)}
            >
              <p>{truncateEthAddress(row.getValue('owner'))}</p>
              {walletAddressCopied === row.index ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {walletAddressCopied === row.index ? 'copied' : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'hasApproved',
      header: 'Status',
      cell: ({ row }) => (
        <div>{row.getValue('hasApproved') ? 'Approved' : 'Not Approved'}</div>
      ),
    },
    {
      accessorKey: 'submissionDate',
      header: 'Submission Date',
      cell: ({ row }) => (
        <div>
          {row.getValue('submissionDate')
            ? formatdbDate(row.getValue('submissionDate'))
            : 'N/A'}
        </div>
      ),
    },
  ];
  return columns;
};
