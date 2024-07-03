import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ListBeneficiary } from '@rahat-ui/types';

export default function useBeneficiaryTableColumn(
  members: any,
  isAssignedToProject: boolean,
) {
  const [prevData, setPrevData] = React.useState(members);
  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      id: 'select',
      header: ({ table }) => {
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            disabled={isAssignedToProject}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const isAssignedMember = members?.some(
          (m: any) => m.uuid === row.original.uuid,
        );
        const isMember = prevData?.some(
          (b: any) => b.uuid === row.original.uuid,
        );
        if (isMember && !row.getIsSelected()) {
          row.toggleSelected(true);
        }
        return (
          <Checkbox
            checked={row.getIsSelected() || isMember}
            disabled={isAssignedMember && isAssignedToProject}
            onCheckedChange={(value) => {
              if (isAssignedMember && isAssignedToProject) {
                return;
              } else {
                row.toggleSelected(!!value);
                if (prevData) {
                  setPrevData((prevData: any) => {
                    return prevData?.beneficiaries?.filter(
                      (b: any) => b.uuid !== row.original.uuid,
                    );
                  });
                }
              }
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.getValue('name') || '-',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.getValue('phone') || '-',
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      cell: ({ row }) => row.getValue('email') || '-',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.getValue('location') || '-',
    },
  ];

  return columns;
}
