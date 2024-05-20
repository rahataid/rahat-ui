import {
  Beneficiary,
  GroupResponseById,
  ListGroup,
} from '@rahataid/community-tool-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash, Trash2 } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';

import Link from 'next/link';
import EditGroupedBeneficiaries from './edit/editGroupedBeneficiaries';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { useCommunityGroupDelete } from '@rahat-ui/community-query';

export const useCommunityGroupTableColumns = () => {
  const deletegroup = useCommunityGroupDelete();
  const handleDeleteGroup = (uuid: string) => {
    deletegroup.mutateAsync(uuid);
  };

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
          <div className="flex gap-4">
            <Link href={`/group/${row.original.uuid}`}>
              <Eye
                size={20}
                strokeWidth={1.5}
                className="cursor-pointer hover:text-primary"
              />
            </Link>

            <Trash2
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer hover:text-primary"
              color="red"
              onClick={() => handleDeleteGroup(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};

export const useCommunityGroupDeailsColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<GroupResponseById>[] = [
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
      id: 'fullName',
      accessorKey: 'beneficiary',
      header: 'Full Name',
      cell: ({ row }) => {
        return (
          row.original.beneficiary.firstName +
            ' ' +
            row.original.beneficiary.lastName ?? '-'
        );
      },
    },
    {
      id: 'phone',
      accessorKey: 'beneficiary',
      header: 'Phone',
      cell: ({ row }) => {
        return row.original.beneficiary.phone ?? '-';
      },
    },
    {
      id: 'gender',
      accessorKey: 'beneficiary',
      header: 'Gender',
      cell: ({ row }) => {
        return row.original.beneficiary.gender ?? '-';
      },
    },
    {
      id: 'govtIDNumber',
      accessorKey: 'beneficiary',
      header: 'Govt. ID Number',
      cell: ({ row }) => {
        return row.original.beneficiary.govtIDNumber ?? '-';
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'View Detail',

      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <EditGroupedBeneficiaries
                    uuid={row?.original?.beneficiary?.uuid as string}
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
