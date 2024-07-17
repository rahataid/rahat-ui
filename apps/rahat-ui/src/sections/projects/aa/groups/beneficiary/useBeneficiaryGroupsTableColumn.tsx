import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { setPaginationToLocalStorage } from '../../usePrevPagination';

export default function useBeneficiaryGroupsTableColumn() {
  const router = useRouter();

  const { id: projectId } = useParams();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectId}/groups/beneficiary/${id}`);
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
      accessorKey: 'members',
      header: 'Member Count',
      cell: ({ row }) => {
        console.log(row);
        return <div>{row.original?._count?.groupedBeneficiaries}</div>;
      },
    },
    // {
    //   accessorKey: 'members',
    //   header: 'Members',
    //   cell: ({ row }) => {
    //     console.log(row);
    //     return (
    //       <div>
    //         {row.original?.members?.map((member: any, index: number) => (
    //           <span key={member?.id}>
    //             {member?.pii?.name}
    //             {index !== row?.original?.members?.length - 1 && ', '}
    //           </span>
    //         ))}
    //       </div>
    //     );
    //   },
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
