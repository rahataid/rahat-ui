'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
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
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Beneficiary Name',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },

    {
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => <div>{humanizeString(row.getValue('groupName'))}</div>,
    },

    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{humanizeString(row.getValue('phone'))}</div>,
    },

    {
      accessorKey: 'govtIDNumber',
      header: 'Govt. ID Number',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('govtIDNumber')) || '-'}</div>
      ),
    },
  ];

  return columns;
};
