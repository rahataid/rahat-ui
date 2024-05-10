'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Result, TargetList } from '@rahataid/community-tool-sdk/targets';
import { formatDate, humanizeString } from '../../../utils';
import Link from 'next/link';
import { Beneficiary } from '@rahataid/community-tool-sdk';
import { useSecondPanel } from 'apps/community-tool-ui/src/providers/second-panel-provider';
import PinnedListBeneficiaryDetail from './pinnedlist.beneficiary.details';

export const useTargetLabelTableColumns = () => {
  const columns: ColumnDef<TargetList>[] = [
    {
      accessorKey: 'label',
      header: 'Label',
      cell: ({ row }) => <div>{humanizeString(row.getValue('label'))}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => <div>{row?.original?.user?.name}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      header: 'Details',
      cell: ({ row }) => {
        return (
          <Link href={`/targeting/${row?.original?.uuid}`}>
            <Eye
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer hover:text-primary"
            />
          </Link>
        );
      },
    },
  ];

  return columns;
};

export const useTargetPinnedListDetailsTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const columns: ColumnDef<Result>[] = [
    {
      accessorKey: 'beneficiary',
      header: 'Full Name',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.firstName && beneficiary.lastName) {
            return `${beneficiary.firstName}  ${beneficiary.lastName}`;
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
      header: 'Govt. ID Number',
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
      header: 'Created At',
      cell: ({ row }) => {
        if (row && row.getValue && typeof row.getValue === 'function') {
          const beneficiary = row.getValue('beneficiary') as Beneficiary;
          if (beneficiary && beneficiary.createdAt) {
            return formatDate(beneficiary.createdAt);
          }
        }
        return 'null';
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'View Detail',

      cell: ({ row }) => {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <PinnedListBeneficiaryDetail
                    data={beneficiary}
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
