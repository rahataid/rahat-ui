'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { Eye } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { humanizeString } from '../../utils';
import BeneficiaryDetail from './beneficiaryDetail';

export const useCommunityBeneficiaryTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

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
      header: 'Beneficiary',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },

    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{humanizeString(row.getValue('gender'))}</div>,
    },

    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('location')) || '-'}</div>
      ),
    },

    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{humanizeString(row.getValue('phone'))}</div>,
    },
    {
      accessorKey: 'extras',
      header: 'Govt. ID Type',
      cell: ({ row }) => {
        const govtIDType =
          row.original?.extras?.household_head_government_id_type || '-';
        return <div>{humanizeString(govtIDType)}</div>;
      },
    },
    {
      accessorKey: 'govtIDNumber',
      header: 'Govt. ID Number',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('govtIDNumber')) || '-'}</div>
      ),
    },
    {
      header: 'Local Level',
      cell: ({ row }) => {
        const localLevel = row.original?.extras?.local_level || '-';
        return <div>{humanizeString(localLevel)}</div>;
      },
    },
    {
      header: 'Ward',
      cell: ({ row }) => {
        const wardNo = row.original?.extras?.ward_no || '-';
        return <div>{wardNo}</div>;
      },
    },
    {
      header: 'Total Members',
      cell: ({ row }) => {
        const totalFamilyMembers =
          row.original?.extras?.total_number_of_family_members || '-';
        return <div>{totalFamilyMembers}</div>;
      },
    },
    {
      header: 'Female',
      cell: ({ row }) => {
        const femaleCount = row.original?.extras?.no_of_female || '-';
        return <div>{femaleCount}</div>;
      },
    },
    {
      header: 'Male',
      cell: ({ row }) => {
        const maleCount = row.original?.extras?.no_of_male || '-';
        return <div>{maleCount}</div>;
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      header: 'Details',
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <BeneficiaryDetail
                    data={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />
                </>,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
};
