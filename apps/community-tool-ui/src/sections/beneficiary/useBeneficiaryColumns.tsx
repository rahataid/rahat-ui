'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { humanizeString } from '../../utils';

export const useCommunityBeneficiaryTableColumns = () => {
  const columns: ColumnDef<ListBeneficiary>[] = [
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.getValue('lastName')}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => <div>{row.getValue('location') || '-'}</div>,
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet',
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('walletAddress')) || '-'}</div>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{humanizeString(row.getValue('gender'))}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: 'Internet Access',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('internetStatus'))}</div>
      ),
    },
    {
      accessorKey: 'phoneStatus',
      header: 'Phone Type',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('phoneStatus'))}</div>
      ),
    },
    {
      accessorKey: 'bankedStatus',
      header: 'Banking Status',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('bankedStatus'))}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
          />
        );
      },
    },
  ];

  return columns;
};
