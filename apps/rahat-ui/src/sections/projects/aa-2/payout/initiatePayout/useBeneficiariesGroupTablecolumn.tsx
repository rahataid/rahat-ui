import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';

function getStatusBg(status: string) {
  if (status === 'NOT_STARTED') {
    return 'bg-gray-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-red-200';
  }

  return '';
}

export default function useBeneficiariesGroupTableColumn() {
  const { id: projectID } = useParams();
  const router = useRouter();

  const handleEyeClick = (activityId: any) => {
    router.push(`/projects/aa/${projectID}/activities/${activityId}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <div className="w-80">{row?.original?.walletAddress}</div>
      ),
    },

    {
      accessorKey: 'totaltokenAssigned',
      header: 'Token Assigned',
      cell: ({ row }) => <div>{100 / row?.original?.total}</div>,
    },
  ];

  return columns;
}
