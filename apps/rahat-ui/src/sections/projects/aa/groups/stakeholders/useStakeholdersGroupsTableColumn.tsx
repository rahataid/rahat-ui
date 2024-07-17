import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye } from 'lucide-react';
import { setPaginationToLocalStorage } from '../../prev.pagination.storage';

export default function useStakeholdersGroupsTableColumn() {
  const router = useRouter();

  const { id: projectId } = useParams();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectId}/groups/stakeholders/${id}`);
  };

  const columns: ColumnDef<any>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',
      header: 'Group Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'stakeholders',
      header: 'Member Count',
      cell: ({ row }) => {
        console.log(row);
        return <div>{row?.original?._count?.stakeholders}</div>;
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
          <Eye
            onClick={() => handleEyeClick(row.original.uuid)}
            className="hover:text-primary cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
        );
      },
    },
  ];

  return columns;
}
