import { ColumnDef } from '@tanstack/react-table';
import { formatUnderScoredString } from 'apps/rahat-ui/src/utils/string';
import { Eye } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';

export const useCambodiaBeneficiaryTableColumns = () => {
  const { id } = useParams();
  const pathName = usePathname();
  const router = useRouter();
  const isDiscardedBeneficiary = pathName.includes('discardedbenificary');
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div>{row.getValue('type')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'healthWorker',
      header: 'Health Worker',
      cell: ({ row }) => (
        <div>
          {formatUnderScoredString(row.getValue('healthWorker') ?? '-')}
        </div>
      ),
    },
  ];
  if (!isDiscardedBeneficiary) {
    columns.push({
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/el-cambodia/${id}/beneficiary/${row.original.uuid}`,
                )
              }
            />
          </div>
        );
      },
    });
  }
  return columns;
};
