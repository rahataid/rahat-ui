import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Beneficiary,
  GroupResponseById,
  ListGroup,
} from '@rahataid/community-tool-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const useCommunityGroupTableColumns = () => {
  const columns: ColumnDef<ListGroup>[] = [
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
      header: 'ID',
      accessorKey: 'ID',
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
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

export const useCommunityGroupDeailsColumns = () => {
  const columns: ColumnDef<GroupResponseById[]>[] = [
    {
      accessorKey: 'beneficiary',
      header: 'FullName',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.firstName && beneficiary.lastName) {
            return beneficiary.firstName + beneficiary.lastName;
          }
        }
        return '';
      },
    },
    {
      accessorKey: 'beneficiary',
      header: 'WalletAddress',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.walletAddress) {
            return beneficiary.walletAddress;
          }
        }
        return '';
      },
    },
    {
      accessorKey: 'beneficiary',
      header: 'customID',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.customId) {
            return beneficiary.customId;
          }
        }
        return '';
      },
    },
    {
      accessorKey: 'beneficiaryId',
      header: 'id',
      cell: ({ row }) => <div>{row.getValue('beneficiaryId')}</div>,
    },
  ];

  return columns;
};
