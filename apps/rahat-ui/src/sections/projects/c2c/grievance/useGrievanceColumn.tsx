'use client';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import GrievanceDetail from './grievance.detail';
// import BeneficiaryDetail from '../../../../sections/projects/el/beneficiary/beneficiary.detail';

export const useGrievanceTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const openSplitDetailView = (rowDetail: any) => {
    setSecondPanelComponent(
      <GrievanceDetail
        closeSecondPanel={closeSecondPanel}
        details={rowDetail}
      />,
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        // const isDisabled = row.getValue('voucher') != 'Not Assigned';
        const isChecked = row.getIsSelected();
        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            // disabled={isDisabled}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'reporter',
      header: 'Reporter',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.original?.reportedBy}
        </div>
      ),
    },

    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div> {row.getValue('title')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div> {row.getValue('type')}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => <div> {row.original?.reporterUser?.name}</div>,
    },
    {
      accessorKey: 'createdOn',
      header: 'Created On',
      cell: ({ row }) => {
        const timestamp = row.original?.createdAt;
        if (!timestamp) return null;

        const [datePart, timePart] = timestamp.split('T');
        const formattedTime = timePart.split('.')[0];

        return (
          <div>
            {datePart} - {formattedTime}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div> {row.getValue('status')}</div>,
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
