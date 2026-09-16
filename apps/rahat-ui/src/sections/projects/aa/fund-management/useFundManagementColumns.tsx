import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { setPaginationToLocalStorage } from '../prev.pagination.storage';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

export const useFundManagementColumns = () => {
  const router = useRouter();
  const { id: projectID } = useParams();
  const t = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectID}/fund-management/${id}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: t('TITLE'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'beneficiaryGroup',
      header: t('BENEFICIARY_GROUP'),
      cell: ({ row }) => <div>{row?.original?.group?.name}</div>,
    },
    {
      accessorKey: 'numberOfTokens',
      header: t('NUMBER_OF_TOKENS'),
      cell: ({ row }) => <div>{formatNum(row.getValue('numberOfTokens'))}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: t('CREATED_BY'),
      cell: ({ row }) => <div>{row.getValue('createdBy')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-evenly">
            <Eye
              className="cursor-pointer"
              onClick={() => handleEyeClick(row.original.uuid)}
              size={20}
              strokeWidth={1.25}
            />
            <Pencil
              className="text-blue-600 cursor-pointer"
              size={20}
              strokeWidth={1.25}
            />
            <Trash2
              className="text-red-600 cursor-pointer"
              size={20}
              strokeWidth={1.25}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
