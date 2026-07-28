import {
  TOKEN_TO_AMOUNT_MULTIPLIER,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useApproveVendorTokenRedemption } from '@rahat-ui/query/lib/aa';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DialogComponent } from 'apps/rahat-ui/src/components/dialog';
import { PaginationTableName } from 'apps/rahat-ui/src/constants/pagination.table.name';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage.dynamic';
import { getAssetCode } from 'apps/rahat-ui/src/utils/stellar';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { UUID } from 'crypto';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { IProjectVendor } from './types';
import { toast } from 'react-toastify';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
// import { DialogComponent } from '../activities/details/dialog.reuse';

interface ITableColumnProps {
  redemptionStatus: string;
  approvedAt: string;
  uuid: string;
  vendor: {
    name: string;
  };
  tokenAmount: number;
  transactionHash: string;
}
export const useProjectVendorTableColumns = (pagination: Pagination) => {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');

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
      header: tg('NAME'),
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('name')} maxLength={30} />
      ),
    },
    {
      accessorKey: 'phone',
      header: tg('PHONE_NUMBER'),
      cell: ({ row }) => <div>{row.getValue('phone') || tg('N_A')}</div>,
    },
    {
      accessorKey: 'registeredApps',
      header: t('REGISTERED_APPS'),
      cell: ({ row }) => {
        const apps =
          row.original?.extras?.registeredApps;

        if (!apps?.length) {
          return <div>{tg('N_A')}</div>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {apps.map((app, index) => (
              <Badge key={index} className="bg-gray-200 text-gray-600">
                {app}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleViewClick(row.original.uuid)}
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
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const { user } = useUserStore((s) => ({ user: s.user }));
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const approveVendorTokenRedemption = useApproveVendorTokenRedemption();

  const handleApproveClick = async (row: Row<ITableColumnProps>) => {
    try {
      if (row?.original?.redemptionStatus === 'APPROVED') {
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
        e instanceof Error ? e.message : t('FAILED_TO_APPROVE_REDEMPTION_REQUEST');
      return toast.error(errorMessage);
    }
  };

  const columns: ColumnDef<ITableColumnProps>[] = [
    {
      accessorKey: 'name',
      header: t('VENDOR_NAME'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.vendor?.name || tg('N_A')}
          maxLength={30}
        />
      ),
    },
    {
      accessorKey: 'tokenAmount',
      header: t('TOTAL_TOKEN'),
      cell: ({ row }) => (
        <TruncatedCell
          text={
            row.getValue('tokenAmount')
              ? `${formatNum(Number(row.getValue('tokenAmount')))} ${getAssetCode(
                settings,
                id,
              )}`
              : tg('N_A')
          }
          maxLength={15}
        />
      ),
    },
    {
      accessorKey: 'amount',
      header: t('TOTAL_AMOUNT'),
      cell: ({ row }) => {
        const totalAmount = row.getValue('tokenAmount')
          ? Number(row.getValue('tokenAmount')) * TOKEN_TO_AMOUNT_MULTIPLIER
          : 0;
        return (
          <TruncatedCell
            text={row.getValue('tokenAmount') ? `Rs. ${formatNum(totalAmount)}` : tg('N_A')}
            maxLength={15}
          />
        );
      },
    },

    {
      accessorKey: 'transactionHash',
      header: t('TX_HASH'),
      cell: ({ row }) => {
        if (!row.original?.transactionHash) {
          return <div>{tg('N_A')}</div>;
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
                : row.original?.redemptionStatus === 'STELLAR_VERIFIED'
                  ? `${t('REQUESTED')} ✓`
                  : t('REQUESTED')
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
          text={
            row.original?.redemptionStatus === 'APPROVED'
              ? user?.data?.name || tg('N_A')
              : tg('N_A')
          }
          maxLength={15}
        />
      ),
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
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
              : tg('N_A')
                    }
                    maxLength={30}
                  />
                </div>
              ) : (
                <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
                  <DialogComponent
                    onSubmit={() => handleApproveClick(row)}
                    onCancel={() => null}
                    title={t('APPROVE_REDEMPTION_REQUEST')}
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
  ];

  return columns;
};
