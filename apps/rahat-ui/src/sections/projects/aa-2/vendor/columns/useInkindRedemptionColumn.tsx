import { useUpdateVendorRedemptionStatus } from '@rahat-ui/query';
import { ColumnDef, Row } from '@tanstack/react-table';
import { InkindRedemptionData } from '../tabs/inkind.redemption.list';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { DialogComponent } from 'apps/rahat-ui/src/components/dialog';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { formatLabel } from '../../inkindManagement/components/inkind.allocation.list';
import { INKIND_TYPE_LABELS } from '../../inkindManagement/schemas/inkind.validation';

export const useInkindRedemptionColumn = (
  id: UUID,
  showActions: boolean = true,
) => {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const tv = useTranslations('AA Project with Gnosis');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const approveRedemptionStatus = useUpdateVendorRedemptionStatus();
  const handleApproveClick = (row: Row<InkindRedemptionData>) => {
    approveRedemptionStatus.mutate({
      projectUUID: id,
      payload: {
        status: 'APPROVED',
        uuid: row.original.uuid,
      },
    });
  };
  const columns: ColumnDef<InkindRedemptionData>[] = [
    {
      header: t('VENDOR_NAME'),
      cell: ({ row }) => {
        return (
          <TruncatedCell
            text={row.original?.vendor?.name || tg('N_A')}
            maxLength={20}
          />
        );
      },
    },
    {
      accessorKey: 'transactionHash',
      header: t('TX_HASH'),
      cell: ({ row }) => {
        if (!row.original?.transactionHash) {
          return <div>{t('N_A')}</div>;
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
      header: t('IN_KIND_ITEM'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.inkind?.name || tg('N_A')}
          maxLength={20}
        />
      ),
    },
    {
      accessorKey: 'type',
      header: tg('TYPE'),
      cell: ({ row }) => {
        const type = row.original?.inkind?.type;
        return (
          <Badge className="bg-gray-200 text-gray-600">
            {formatLabel(INKIND_TYPE_LABELS[type])}
          </Badge>
        );
      },
    },

    {
      accessorKey: 'quantity',
      header: tv('QUANTITY'),
      cell: ({ row }) => <div>{formatNum(row.original.quantity)}</div>,
    },

    {
      accessorKey: 'redemptionStatus',
      header: tg('STATUS'),
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
                ? t('APPROVED')
                : row.original?.redemptionStatus === 'REQUESTED'
                ? `${t('REQUESTED')} ✓`
                : ''
            }
            maxLength={15}
          />
        </Badge>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: t('APPROVED_BY'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.approvedBy || tg('N_A')}
          maxLength={12}
        />
      ),
    },
    ...(showActions
      ? [
          {
            id: 'actions',
            header: tg('ACTIONS'),
            enableHiding: false,
            cell: ({ row }: { row: Row<InkindRedemptionData> }) => {
              const status = row.original?.redemptionStatus?.toLowerCase();
              return (
                <>
                  <div className="flex items-center justify-start">
                    {status === 'approved' ? (
                      <div className="font-inter font-normal text-[12px] leading-[20px] tracking-[0] text-[#475263]">
                        <div>{t('APPROVED_ON')}</div>
                        <TruncatedCell
                          text={
                            row.original?.redemptionStatus === 'APPROVED' &&
                            row.original?.approvedAt
                              ? formatDate(row.original?.approvedAt)
                              : t('N_A')
                          }
                          maxLength={30}
                        />
                      </div>
                    ) : (
                      <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
                        <DialogComponent
                          onSubmit={() => handleApproveClick(row)}
                          onCancel={() => null}
                          title={tv('APPROVE_INKIND_REDEMPTION_REQUEST')}
                          subtitle={t('CONFIRM_APPROVE_REDEMPTION')}
                          trigger={
                            <div className="cursor-pointer select-none text-[#297AD6]">
                              {t('APPROVE')}
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
        ]
      : []),
  ];
  return columns;
};
