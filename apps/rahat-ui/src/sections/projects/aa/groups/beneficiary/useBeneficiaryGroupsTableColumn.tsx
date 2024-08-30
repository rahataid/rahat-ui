import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { setPaginationToLocalStorage } from '../../prev.pagination.storage';

export default function useBeneficiaryGroupsTableColumn() {
  const router = useRouter();

  const { id: projectId } = useParams();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectId}/groups/beneficiary/${id}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Group Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'members',
      header: 'Member Count',
      cell: ({ row }) => {
        return <div>{row.original?._count?.groupedBeneficiaries}</div>;
      },
    },
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
