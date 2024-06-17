import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye } from 'lucide-react';

export default function useStakeholdersGroupsTableColumn() {
  const { id: projectId } = useParams();
  const groupDetailPath = (groupId: string) =>
    `/projects/aa/${projectId}/groups/stakeholders/${groupId}`;

  const columns: ColumnDef<any>[] = [
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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Group Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'stakeholders',
      header: 'Member Count',
      cell: ({ row }) => {
        console.log(row)
        return ((
          <div>
           {row?.original?._count?.stakeholders}
          </div>
        ))
      },
    },
    // {
    //   accessorKey: 'stakeholders',
    //   header: 'Member',
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original?.stakeholders?.map((member: any, index: number) => (
    //         <span key={member?.id}>
    //           {member?.name}
    //           {index !== row.original.stakeholders.length - 1 && ', '}
    //         </span>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Link href={groupDetailPath(row?.original?.uuid)}>
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
            />
          </Link>
        );
      },
    },
  ];

  return columns;
}
