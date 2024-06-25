'use client';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import BeneficiaryDetail from '../../../../sections/projects/el/beneficiary/beneficiary.detail';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export const useProjectBeneficiaryTableColumns = (voucherType: string, projectBeneficiaries: any) => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const openSplitDetailView = useCallback((rowDetail: any) => {
    setSecondPanelComponent(
      <BeneficiaryDetail
        closeSecondPanel={closeSecondPanel}
        beneficiaryDetails={rowDetail}
        projectBeneficiaries={projectBeneficiaries}
      />,
    );
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) =>
        voucherType === 'NOT_ASSIGNED' && (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
      cell: ({ row }) => {
        const isDisabled = voucherType != 'NOT_ASSIGNED';
        const isChecked = row.getIsSelected() && !isDisabled;
        return (
          !isDisabled && (
            <Checkbox
              checked={isChecked}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              disabled={isDisabled}
            />
          )
        );
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
      accessorKey: 'voucherType',
      header: 'Voucher',
      cell: ({ row }) => <div> {voucherType}</div>,
    },
    {
      accessorKey: 'voucherClaimStatus',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Claim Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-5"> {row.getValue('voucherClaimStatus')}</div>
      ),
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
