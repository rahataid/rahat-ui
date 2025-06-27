import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, CopyCheck, MoreHorizontal } from 'lucide-react';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useUpdateElRedemption,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Redemption } from './redemption.table';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

export const useTableColumns = (
  handleAssignClick: any,
  getRedemptions: any,
) => {
  const { id } = useParams();
  const [selectedRow, setSelectedRow] = useState(null);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const projectVoucher = useProjectVoucher(
    contractSettings?.elproject?.address || '',
    contractSettings?.eyevoucher?.address || '',
  );

  const projectModal = useBoolean();

  const handleConfirmationModal = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const uuid = useParams().id;

  const updateRedemption = useUpdateElRedemption();

  const handleApprove = async () => {
    await updateRedemption
      .mutateAsync({
        projectUUID: uuid,
        redemptionUUID: [selectedRow?.uuid],
      })
      .finally(() => {
        setSelectedRow(null);
        projectModal.onFalse();
        getRedemptions();
      });
  };

  const columns: ColumnDef<Redemption>[] = [
    {
      id: 'select',
      header: '',
      cell: ({ row }) => {
        const isDisabled = row.getValue('status') === 'APPROVED';
        const isChecked = row.getIsSelected() && !isDisabled;
        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            disabled={isDisabled}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            WalletAddress
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row.getValue('walletAddress'), row.index)
              }
            >
              <p>{truncateEthAddress(row.getValue('walletAddress'))}</p>
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
      accessorKey: 'voucherType',
      header: 'Voucher Type ',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('voucherType')}</div>
      ),
    },
    {
      accessorKey: 'tokenAmount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Token
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-1/3 text-center">{row.getValue('tokenAmount')}</div>
      ),
    },
    {
      accessorKey: 'claimValue',
      header: 'Claims Value',
      cell: ({ row }) => {
        return (
          <>
            {projectVoucher?.data?.referredVoucherPrice ? (
              <div className="w-1/3 text-center">
                {row.original.tokenAmount *
                  projectVoucher?.data?.referredVoucherPrice}
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-1 h-full">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
              </div>
            )}
          </>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;
        if (rowData.status === 'APPROVED') return null;
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleConfirmationModal(rowData)}
                >
                  Approve Redemption
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={projectModal.value}
              onOpenChange={projectModal.onToggle}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Redemption</DialogTitle>
                  <DialogDescription>
                    <p className="text-orange-500">
                      Are you sure you want to approve the redemption?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleApprove}
                    type="button"
                    variant="ghost"
                    className="text-primary"
                  >
                    Approve
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
  ];

  return columns;
};
