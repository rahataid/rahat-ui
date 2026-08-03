import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { setPaginationToLocalStorage } from '../../prev.pagination.storage';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function useStakeholdersGroupsTableColumn() {
  const router = useRouter();
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const { id: projectId } = useParams();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectId}/groups/stakeholders/${id}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: tg('GROUP_NAME'),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'stakeholders',
      header: tg('TOTAL_MEMBERS'),
      cell: ({ row }) => {
        return <div>{formatNum(row?.original?._count?.stakeholders)}</div>;
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
