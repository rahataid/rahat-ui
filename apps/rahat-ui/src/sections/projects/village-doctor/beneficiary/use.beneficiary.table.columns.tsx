import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export function villageDoctorDisplayName(row: Record<string, any> | undefined) {
  if (!row) return '-';
  const hw =
    row.healthWorker ?? row.health_worker ?? row.HealthWorker ?? null;
  const fromRelation = hw?.name ?? (typeof hw === 'string' ? hw : '');
  if (fromRelation) return fromRelation;

  const ex =
    row.extras &&
    typeof row.extras === 'object' &&
    row.extras !== null
      ? (row.extras as Record<string, unknown>)
      : undefined;
  const meta =
    ex?.meta &&
    typeof ex.meta === 'object' &&
    ex.meta !== null
      ? (ex.meta as Record<string, unknown>)
      : undefined;

  const fromExtrasRaw =
    (typeof ex?.healthWorkerName === 'string' && ex.healthWorkerName) ||
    (typeof ex?.Health_Worker_Name === 'string' && ex.Health_Worker_Name) ||
    (typeof meta?.Health_Worker_Name === 'string' && meta.Health_Worker_Name);

  const fromExtras =
    typeof fromExtrasRaw === 'string' ? fromExtrasRaw.trim() : '';
  return fromExtras ? fromExtras : '-';
}

export const useCambodiaBeneficiaryTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row?.original?.piiData?.name}</div>,
    },
    // {
    //   accessorKey: 'type',
    //   header: 'Type',
    //   cell: ({ row }) => {
    //     return <div>{row?.original?.type || 'UNKNOWN'}</div>;
    //   },
    // },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row?.original?.piiData?.phone}</div>,
    },
    // {
    //   accessorKey: 'gender',
    //   header: 'Gender',
    //   cell: ({ row }) => <div>{row?.original?.projectData?.gender}</div>,
    // },
    {
      accessorKey: 'healthWorker',
      header: 'Village Doctor',
      cell: ({ row }) => (
        <div>{villageDoctorDisplayName(row?.original)}</div>
      ),
    },

    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedDate = date.toLocaleDateString('en-Us', {
          timeZone,
        });
        const formattedTime = date.toLocaleTimeString('en-Us', {
          timeZone,
        });
        return (
          <div className="lowercase ml-4">
            {formattedDate} {formattedTime}
          </div>
        );
      },
    },

    {
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
                  `/projects/el-village-doctor/${id}/villagers/${row.original.uuid}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

export const useDiscardedCambodiaBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    // {
    //   accessorKey: 'type',
    //   header: 'Type',
    //   cell: ({ row }) => {
    //     return <div>{row?.original?.extras?.type || 'UNKNOWN'}</div>;
    //   },
    // },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    // {
    //   accessorKey: 'gender',
    //   header: 'Gender',
    //   cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    // },
    {
      accessorKey: 'healthWorker',
      header: 'Village Doctor',
      cell: ({ row }) => (
        <div>{villageDoctorDisplayName(row?.original)}</div>
      ),
    },
  ];

  return columns;
};
