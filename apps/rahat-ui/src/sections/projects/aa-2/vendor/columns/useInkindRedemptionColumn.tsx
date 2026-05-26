import { useUpdateVendorRedemptionStatus } from '@rahat-ui/query';
import { ColumnDef } from '@tanstack/react-table';
import { DummyInkindRedemption } from '../tabs/inkind.redemption.list';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { DialogComponent } from 'apps/rahat-ui/src/components/dialog';
import { UUID } from 'crypto';

export const useInkindRedemptionColumn = (id: UUID) => {
  const approveRedemptionStatus = useUpdateVendorRedemptionStatus();
  const handleApproveClick = (row: any) => {
    approveRedemptionStatus.mutate({
      projectUUID: id,
      payload: {
        redemptionStatus: 'APPROVED',
        uuid: row.original.uuid,
      },
    });
  };
  const columns: ColumnDef<DummyInkindRedemption>[] = [
    {
      header: 'Vendor Name',
      cell: ({ row }) => {
        return (
          <TruncatedCell
            text={row.original?.vendor?.name || 'N/A'}
            maxLength={20}
          />
        );
      },
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
                className=" text-blue-500 hover:underline cursor-pointer "
              >
                <TruncatedCell
                  text={row.getValue('transactionHash')}
                  maxLength={10}
                />
              </a>
            </div>
            <CopyTooltip
              value={row.getValue('transactionHash')}
              uniqueKey={row.getValue('transactionHash')}
            />
          </div>
        );
      },
    },
    {
      header: 'In-kind Item',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.inkind?.name || 'N/A'}
          maxLength={20}
        />
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
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
          <TruncatedCell
            text={
              row.original?.redemptionStatus === 'APPROVED'
                ? 'Approved'
                : row.original?.redemptionStatus === 'REQUESTED'
                ? 'Requested ✓'
                : ''
            }
            maxLength={15}
          />
        </Badge>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.approvedBy || 'N/A'}
          maxLength={12}
        />
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
                  <TruncatedCell
                    text={
                      row.original?.redemptionStatus === 'APPROVED' &&
                      row.original?.approvedAt
                        ? dateFormat(row.original?.approvedAt)
                        : 'N/A'
                    }
                    maxLength={30}
                  />
                </div>
              ) : (
                <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
                  <DialogComponent
                    onSubmit={() => handleApproveClick(row)}
                    onCancel={() => null}
                    title="Approve Inkind Redemption Request"
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
