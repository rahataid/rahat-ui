import { useApproveVendorTokenRedemption } from '@rahat-ui/query/lib/aa';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useUserStore } from '@rumsan/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { UUID } from 'crypto';
import { Check, Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IProjectVendor } from './types';
import {
  TOKEN_TO_AMOUNT_MULTIPLIER,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { getAssetCode, getStellarTxUrl } from 'apps/rahat-ui/src/utils/stellar';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';

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

export const useProjectVendorRedemptionTableColumns = () => {
  const { id }: { id: UUID } = useParams();
  const { user } = useUserStore((s) => ({ user: s.user }));
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const approveVendorTokenRedemption = useApproveVendorTokenRedemption();
  const { clickToCopy, copyAction } = useCopy();

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
      cell: ({ row }) => <div>{row.original?.vendor?.name || 'N/A'}</div>,
    },
    {
      accessorKey: 'tokenAmount',
      header: 'Total Token',
      cell: ({ row }) => (
        <div>
          {row.getValue('tokenAmount')
            ? `${Number(row.getValue('tokenAmount'))} ${getAssetCode(
                settings,
                id,
              )}`
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div>
          {row.getValue('tokenAmount')
            ? `Rs. ${
                Number(row.getValue('tokenAmount')) * TOKEN_TO_AMOUNT_MULTIPLIER
              }`
            : 'N/A'}
        </div>
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
            : row.original?.redemptionStatus === 'STELLAR_VERIFIED'
            ? 'Requested ✓'
            : 'Requested'}
        </Badge>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: 'TxHash',
      cell: ({ row }) => {
        if (!row.original?.transactionHash) {
          return <div>N/A</div>;
        }
        return (
          <div className="flex flex-row">
            <div className="w-20 truncate">
              <a
                href={getStellarTxUrl(
                  settings,
                  id,
                  row?.original?.transactionHash,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer "
              >
                {row.getValue('transactionHash')}
              </a>
            </div>
            <button
              onClick={() =>
                clickToCopy(
                  row.getValue('transactionHash'),
                  row.getValue('transactionHash'),
                )
              }
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === row.getValue('transactionHash') ? (
                <CopyCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => (
        <div>
          {row.original?.redemptionStatus === 'APPROVED'
            ? user?.data?.name || 'N/A'
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'approvedAt',
      header: 'Approved Date',
      cell: ({ row }) => (
        <div>
          {row.original?.redemptionStatus === 'APPROVED' &&
          row.getValue('approvedAt')
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
