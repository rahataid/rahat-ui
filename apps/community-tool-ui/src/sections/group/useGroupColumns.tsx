import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Beneficiary,
  GroupResponseById,
  ListGroup,
} from '@rahataid/community-tool-sdk';
import { truncateEthAddress } from '@rumsan/sdk/utils';
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
      header: 'Phone',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.phone) {
            return beneficiary.phone;
          }
        }
        return 'null';
      },
    },
    {
      accessorKey: 'beneficiary',
      header: 'WalletAddress',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.walletAddress) {
            return truncateEthAddress(beneficiary.walletAddress);
          }
        }
        return '';
      },
    },
    {
      accessorKey: 'beneficiary',
      header: 'Gender',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.gender) {
            return beneficiary.gender;
          }
        }
        return '';
      },
    },
    {
      accessorKey: 'beneficiary',
      header: 'GovernmentIdNumber',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.govtIDNumber) {
            return beneficiary.govtIDNumber;
          }
        }
        return 'null';
      },
    },
    {
      accessorKey: 'beneficiary',
      header: 'CreatedAt',
      cell: ({ row }) => {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        const changedDate = new Date(beneficiary.createdAt as Date);
        const formattedDate = changedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return <div>{formattedDate}</div>;
      },
    },
  ];

  return columns;
};
