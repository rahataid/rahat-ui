import {
  useApproveVendorTokenRedemption,
  useTriggerForPayoutFailed,
  useTriggerPayout,
} from '@rahat-ui/query/lib/aa';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useUserStore } from '@rumsan/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { UUID } from 'crypto';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IProjectVendor } from './types';

export const useProjectVendorTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (vendorId: string) => {
    router.push(`/projects/aa/${id}/vendors/${vendorId}`);
  };

  const columns: ColumnDef<IProjectVendor>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
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
              onClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};

export const useProjectVendorRedemptionTableColumns = (id: UUID) => {
  const { user } = useUserStore((s) => ({ user: s.user }));

  const approveVendorTokenRedemption = useApproveVendorTokenRedemption();

  const handleApproveClick = async (row: any) => {
    console.log('handle approve click');
    try {
      if (row?.redemptionStatus === 'APPROVED') {
        console.error('Already approved');
        return;
      }
      approveVendorTokenRedemption.mutateAsync({
        projectUUID: id,
        payload: {
          redemptionStatus: 'APPROVED',
          uuid: row.original?.uuid,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Vendor Name',
      cell: ({ row }) => (
        <div>
          {row.original?.vendor?.name ? row.original?.vendor?.name : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'tokenAmount',
      header: 'Total Token',
      cell: ({ row }) => <div>{row.getValue('tokenAmount') || 'N/A'}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div>{`Rs. ${row.getValue('tokenAmount')}` || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'redemptionStatus',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className="text-xs font-normal"
          style={{
            backgroundColor:
              row.original?.redemptionStatus === 'APPROVED'
                ? '#ECFDF3'
                : '#EFF8FF',
            color:
              row.original?.redemptionStatus === 'APPROVED'
                ? '#027A48'
                : '#175CD3',
          }}
        >
          {row.original?.redemptionStatus === 'APPROVED'
            ? 'Approved'
            : 'Requested'}
        </Badge>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: () => <div>{user?.data?.name || 'N/A'}</div>,
    },
    {
      accessorKey: 'approvedAt',
      header: 'Approved Date',
      cell: ({ row }) => (
        <div>
          {row.getValue('approvedAt')
            ? dateFormat(row.getValue('approvedAt'))
            : 'N/A'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.original?.redemptionStatus?.toLowerCase();

        return (
          <div className="flex items-center justify-center">
            {status === 'approved' ? (
              <div className="text-[#2A9D90]">Approved</div>
            ) : (
              <Button
                variant="ghost"
                className="text-[#297AD6]"
                onClick={() => handleApproveClick(row)}
              >
                Approve
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
};
