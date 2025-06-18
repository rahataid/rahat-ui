'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye, Copy, CopyCheck, TriangleAlertIcon } from 'lucide-react';
import BeneficiaryDetail from './beneficiaryDetail';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ListBeneficiary } from '@rahat-ui/types';
import { useSearchParams } from 'next/navigation';

export const useBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<string>();

  const searchParam = useSearchParams();

  const members = searchParam.get('member');

  const clickToCopy = (walletAddress: string, uuid: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(uuid);
  };
  const openSplitDetailView = (rowDetail: ListBeneficiary) => {
    setSecondPanelComponent(
      <BeneficiaryDetail
        beneficiaryDetail={rowDetail}
        closeSecondPanel={closeSecondPanel}
      />,
    );
  };

  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          // className={members ? '' : 'hidden'}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        // const piiData = row.getValue('piiData') as any;
        return (
          <div
            className="cursor-pointer"
            onClick={() => openSplitDetailView(row.original)}
          >
            {row.getValue('name')}
          </div>
        );
      },
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
                clickToCopy(row.getValue('walletAddress'), row?.original?.uuid)
              }
            >
              <p className="truncate w-28">
                {truncateEthAddress(row.getValue('walletAddress'))}
              </p>
              {walletAddressCopied &&
              walletAddressCopied === row?.original?.uuid ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {walletAddressCopied &&
                walletAddressCopied === row?.original?.uuid
                  ? 'copied'
                  : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: 'Internet Access',
      cell: ({ row }) => <div>{row.getValue('internetStatus')}</div>,
    },
    {
      accessorKey: 'phoneStatus',
      header: 'Phone Type',
      cell: ({ row }) => <div>{row.getValue('phoneStatus')}</div>,
    },
    {
      accessorKey: 'bankedStatus',
      header: 'Banking Status',
      cell: ({ row }) => <div>{row.getValue('bankedStatus')}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <Eye
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer hover:text-primary"
              onClick={() => openSplitDetailView(row.original)}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="hover:cursor-pointer py-0">
                  <TriangleAlertIcon
                    size={16}
                    strokeWidth={1.5}
                    color="red"
                    className={`${
                      !row.original.error && 'hidden'
                    } text-red-500 hover:cursor-pointer`}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="w-96 rounded-sm p-4 max-h-60 overflow-auto"
                >
                  <div className="flex space-x-2 items-center">
                    <TriangleAlertIcon
                      size={16}
                      strokeWidth={1.5}
                      color="red"
                    />
                    <span className="font-semibold text-sm/6">
                      Bank Account Validation Failed
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 break-words">
                    {row.original.error ?? 'Something went wrong!!'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return columns;
};
