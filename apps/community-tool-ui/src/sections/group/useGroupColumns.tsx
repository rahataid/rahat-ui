import {
  Beneficiary,
  GroupResponseById,
  ListGroup,
} from '@rahataid/community-tool-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';

import Link from 'next/link';
import EditGroupedBeneficiaries from './edit/editGroupedBeneficiaries';

export const useCommunityGroupTableColumns = () => {
  const columns: ColumnDef<ListGroup>[] = [
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
      header: 'Created By',
      cell: ({ row }) => {
        return <div>{row.original.user?.name || '-'}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'View Detail',
      cell: ({ row }) => {
        return (
          <Link href={`/group/${row.original.uuid}`}>
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

export const useCommunityGroupDeailsColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<GroupResponseById[]>[] = [
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
      id: 'actions',
      enableHiding: false,
      header: 'View Detail',

      cell: ({ row }) => {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        console.log('row', row.original);
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <EditGroupedBeneficiaries
                    uuid={beneficiary?.uuid as string}
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
