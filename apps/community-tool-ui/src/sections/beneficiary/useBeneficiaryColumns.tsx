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
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{humanizeString(row.getValue('gender'))}</div>,
    },

    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{humanizeString(row.getValue('phone'))}</div>,
    },
    {
      accessorKey: 'govtIDNumber',
      header: 'Govt ID Number',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('govtIDNumber'))}</div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => <div>{row.getValue('location') || '-'}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: 'Internet Access',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('internetStatus'))}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'View Details',
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
