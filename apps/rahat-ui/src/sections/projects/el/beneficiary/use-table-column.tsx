'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import BeneficiaryDetail from '../../../../sections/projects/el/beneficiary/beneficiary.detail';
import { truncateEthAddress } from '@rumsan/sdk/utils';

export const useProjectBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const openSplitDetailView = (rowDetail: any) => {
    setSecondPanelComponent(
      <BeneficiaryDetail
        closeSecondPanel={closeSecondPanel}
        beneficiaryDetails={rowDetail}
      />,
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: "",
      // ({ table }) => (
      //   <Checkbox
      //     checked={
      //       table.getIsAllPageRowsSelected() ||
      //       (table.getIsSomePageRowsSelected() && 'indeterminate')
      //     }
      //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //     aria-label="Select all"
      //   />
      // ),
      cell: 
      ({ row }) => {
        const isDisabled = row.getValue('voucher') != 'Not Assigned';
        const isChecked = row.getIsSelected() && !isDisabled;
        return (!isDisabled && <Checkbox
          checked={isChecked}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isDisabled}
        />)
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div> {row.getValue('type')}</div>,
    },
    
    // {
    //   accessorKey: 'Type',
    //   header: 'Type',
    //   cell: ({ row }) => (
    //     <div className="capitalize">
    //       {row.getValue('vouvherType')
    //         ? `${row
    //             .getValue('vouvherType')
    //             ?.toString()
    //             .substring(0, 4)}....${row
    //             .getValue('vouvherType')
    //             ?.toString()
    //             ?.slice(-3)}`
    //         : 'N/A'}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div> {row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'voucher',
      header: 'Voucher',
      cell: ({ row }) => <div> {row.getValue('voucher')}</div>,
    },
    {
      accessorKey: 'voucherClaimStatus',
      header: 'Claim Status',
      cell: ({ row }) => <div> {row.getValue('voucherClaimStatus').toString()}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];

  return columns;
};
