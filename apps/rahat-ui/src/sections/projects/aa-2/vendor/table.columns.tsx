import {
  TOKEN_TO_AMOUNT_MULTIPLIER,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useApproveVendorTokenRedemption } from '@rahat-ui/query/lib/aa';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { ColumnDef } from '@tanstack/react-table';
import { DialogComponent } from 'apps/rahat-ui/src/components/dialog';
import { PaginationTableName } from 'apps/rahat-ui/src/constants/pagination.table.name';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage.dynamic';
import { getAssetCode } from 'apps/rahat-ui/src/utils/stellar';
import { UUID } from 'crypto';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IProjectVendor } from './types';
import { toast } from 'react-toastify';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';
// import { DialogComponent } from '../activities/details/dialog.reuse';

export const useProjectVendorTableColumns = (pagination: Pagination) => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (vendorId: string) => {
    setPaginationToLocalStorage(`${PaginationTableName.VENDOR_LIST}`);
    router.push(
      `/projects/aa/${id}/vendors/${vendorId}#pagination=${encodeURIComponent(
        JSON.stringify(pagination),
      )}`,
    );
  };

  const columns: ColumnDef<IProjectVendor>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('name')} maxLength={30} />
      ),
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
    try {
      if (row?.redemptionStatus === 'APPROVED') {
        throw new Error('Status is already Approved');
      }

      approveVendorTokenRedemption.mutateAsync({
        projectUUID: id,
        payload: {
          redemptionStatus: 'APPROVED',
          uuid: row.original?.uuid,
        },
      });
    } catch (e: unknown) {
      console.error(e);
      const errorMessage =
        e instanceof Error ? e.message : 'Failed to approve redemption request';
      return toast.error(errorMessage);
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
                href={`https://sepolia.basescan.org/tx/${row.getValue(
                  'transactionHash',
                )}`}
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
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.original?.redemptionStatus?.toLowerCase();
        return (
          <>
            <div className="flex items-center justify-start">
              {status === 'approved' ? (
                <div className="font-inter font-normal text-[12px] leading-[20px] tracking-[0] text-[#475263]">
                  <div>Approved on:</div>
                  <div>
                    {row.original?.redemptionStatus === 'APPROVED' &&
                    row.original?.approvedAt
                      ? dateFormat(row.original?.approvedAt)
                      : 'N/A'}
                  </div>
                </div>
              ) : (
                <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
                  <DialogComponent
                    onSubmit={() => handleApproveClick(row)}
                    onCancel={() => null}
                    title="Approve Redemption Request"
                    subtitle="Are you sure you want to approve this redemption request?"
                    trigger={
                      <div className="cursor-pointer select-none text-[#297AD6]">
                        Approve
                      </div>
                    }
                  />
                </RoleAuth>
              )}
            </div>
          </>
        );
      },
    },
  ];

  return columns;
};
