'use client';
import { useTranslations } from 'next-intl';
import {
  useGetPayoutLogs,
  usePagination,
  usePayoutExportLogs,
  useSinglePayout,
  useTriggerForPayoutFailed,
  useTriggerPayout,
} from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import {
  Back,
  CustomPagination,
  DataCard,
  DemoTable,
  Heading,
  SearchInput,
  TableLoader,
} from 'apps/rahat-ui/src/common';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { UUID } from 'crypto';
import { CloudDownload, RotateCcw } from 'lucide-react';
import PayoutConfirmationDialog from './payoutTriggerConfirmationModel';
import useBeneficiaryGroupDetailsLogColumns from './useBeneficiaryGroupDetailsLogColumns';
import * as XLSX from 'xlsx';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import { getPayoutTransactionStatusOptions } from './utils';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
// TODO: remove this table if used nowhgere
// import BeneficiariesGroupTable from './beneficiariesGroupTable';

export default function BeneficiaryGroupTransactionDetailsList() {
  const t = useTranslations('AA Project');
  const tv = useTranslations('AA Project with Cash Tracker');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const params = useParams();
  const projectId = params.id as UUID;
  const payoutId = params.detailID as UUID;
  const searchParams = useSearchParams();
  const navigation = searchParams.get('from');
  const router = useRouter();
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const { data: payout, isLoading } = useSinglePayout(projectId, {
    uuid: payoutId,
  });
  const debounsSearch = useDebounce(filters, 500);
  const { data: payoutlogs, isLoading: payoutLogsLoading } = useGetPayoutLogs(
    projectId,
    {
      payoutUUID: payoutId,
      ...debounsSearch,
      page: pagination.page,
      perPage: pagination.perPage,
      sort: 'updatedAt',
      order: 'desc',
    },
  );

  const triggerForPayoutFailed = useTriggerForPayoutFailed();
  const triggerPayout = useTriggerPayout();
  const columns = useBeneficiaryGroupDetailsLogColumns(payout?.type);
  const { data: exportPayoutLogs } = usePayoutExportLogs({
    projectUUID: projectId,
    payoutUUID: payoutId,
  });

  const handleDownload = () => {
    const correctedLogs = (exportPayoutLogs || []).map(
      (row: Record<string, unknown>) => {
        return {
          ...row,
          'Updated At': formatDate(row['Updated At'] as string),
        };
      },
    );
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(correctedLogs);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FailedLogs');
    XLSX.writeFile(workbook, 'payout-logs.xlsx');
  };

  const table = useReactTable({
    manualPagination: true,
    data: payoutlogs?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue = value === 'ALL' ? '' : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const handleTriggerPayoutFailed = React.useCallback(async () => {
    triggerForPayoutFailed.mutateAsync({
      projectUUID: projectId,
      payload: {
        payoutUUID: payoutId,
      },
    });
  }, [triggerForPayoutFailed]);

  const handleTriggerPayout = React.useCallback(async () => {
    triggerPayout.mutateAsync({
      projectUUID: projectId,
      payload: {
        uuid: payoutId,
      },
    });
  }, [triggerPayout]);

  const payoutStats = [
    {
      label: tv('ACTUAL_BUDGET'),
      smallNumber: `Rs. ${
        payout?.beneficiaryGroupToken?.numberOfTokens * ONE_TOKEN_VALUE
      }`,
      infoIcon: true,
      infoToolTip: tv('ACTUAL_BUDGET_TOOLTIP'),
    },
    {
      label: tv('AMOUNT_DISBURSED'),
      smallNumber: `Rs. ${payout?.totalSuccessAmount}`,
      infoIcon: true,
      infoToolTip: tv('AMOUNT_DISBURSED_TOOLTIP'),
    },
    {
      label: tv('PAYOUT_TYPE'),
      infoIcon: true,
      infoToolTip: tv('PAYOUT_TYPE_TOOLTIP'),
      smallNumber: payout?.type === 'VENDOR' ? 'CVA' : payout?.type,
      badge: true,
    },
    {
      label: tv('PAYOUT_METHOD'),
      infoIcon: true,
      infoToolTip: tv('PAYOUT_METHOD_TOOLTIP'),
      smallNumber:
        payout?.type === 'VENDOR'
          ? payout?.mode
          : payout?.extras?.paymentProviderName,
      badge: true,
    },
  ];

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  return isLoading ? (
    <TableLoader />
  ) : (
    <div className="p-4 pb-0">
      <div className="flex flex-col space-y-0">
        <Back
          path={
            navigation === 'payoutOverview'
              ? `/projects/aa/${projectId}/payout?tab=payoutOverview`
              : `/projects/aa/${projectId}/payout?tab=payoutList`
          }
        />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`${payout?.beneficiaryGroupToken?.beneficiaryGroup?.name}`}
              description={tv('LIST_OF_ALL_THE_PAYOUT_TRANSACTION')}
              status={payout?.status
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/^./, (char: string) => char.toUpperCase())}
              badgeClassName={isCompleteBgStatus(payout?.status)}
            />
          </div>
          {
            <div className="flex gap-2">
              <PayoutConfirmationDialog
                onConfirm={() => handleTriggerPayout()}
                payoutData={payout}
              />
              {payout?.type === 'FSP' && (
                <RoleAuth
                  roles={[AARoles.ADMIN, AARoles.Municipality]}
                  hasContent={false}
                >
                  <Button
                    className={`gap-2 text-sm ${
                      payout?.hasFailedPayoutRequests === false && 'hidden'
                    }`}
                    onClick={handleTriggerPayoutFailed}
                    disabled={triggerForPayoutFailed.isPending}
                  >
                    <RotateCcw
                      className={`${
                        triggerForPayoutFailed.isPending ? 'animate-spin' : ''
                      } w-4 h-4`}
                    />
                    {tv('RETRY_FAILED_REQUESTS')}
                  </Button>
                </RoleAuth>
              )}

              {payout?.type === 'FSP' &&
                (payout?.extras?.paymentProviderName ===
                  'Manual Bank Transfer' ||
                  payout?.extras?.paymentProviderName === 'Manual') && (
                  <RoleAuth
                    roles={[AARoles.ADMIN, AARoles.Municipality]}
                    hasContent={false}
                  >
                    <TooltipWrapper
                      tip={tv('PAYOUT_CANNOT_BE_VERIFIED')}
                      disable={payout?.beneficiaryGroupToken?.isDisbursed}
                    >
                      <Button
                        className={`gap-2 text-sm ${
                          payout?.status === 'COMPLETED' && 'hidden'
                        } `}
                        disabled={!payout?.beneficiaryGroupToken?.isDisbursed}
                        onClick={() =>
                          router.push(
                            `/projects/aa/${projectId}/payout/details/${payoutId}/verify`,
                          )
                        }
                      >
                        {tv('VERIFY_MANUAL_PAYOUT')}
                      </Button>
                    </TooltipWrapper>
                  </RoleAuth>
                )}
              <Button
                className={`gap-2 text-sm ${
                  payoutlogs?.data?.length === 0 && 'hidden'
                }`}
                onClick={handleDownload}
                variant={'outline'}
              >
                <CloudDownload className={`w-4 h-4`} />
                {tv('DOWNLOAD_PAYOUT_LOGS')}
              </Button>
            </div>
          }
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            payout?.type === 'VENDOR' && payout?.mode === 'OFFLINE'
              ? 'lg:grid-cols-5'
              : 'lg:grid-cols-4'
          } gap-4`}
        >
          {payoutStats?.map((item) => (
            <DataCard
              key={item.label}
              title={item.label}
              className="rounded-sm h-[80px] pt-10 pb-8"
              infoIcon={item.infoIcon}
              infoTooltip={item.infoToolTip}
              badge={item.badge}
              smallNumber={item.smallNumber}
            />
          ))}

          {payout?.type === 'VENDOR' && payout?.mode === 'OFFLINE' && (
            <DataCard
              title={tv('VENDOR')}
              infoIcon={true}
              infoTooltip={tv('VENDOR_TOOLTIP')}
              smallNumber={payout?.extras?.vendorName}
              className="rounded-sm h-[80px] pt-10 pb-8"
              badge
            />
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-4 pt-2">
          <DataCard
            title={tv('TOTAL_NO_OF_BENEFICIARIES')}
            smallNumber={formatNum(payout?.beneficiaryGroupToken?.beneficiaryGroup?._count?.beneficiaries ?? 0)}
            className="rounded-sm h-[80px] pt-10 pb-8 "
            infoIcon={true}
            infoTooltip={tv('TOTAL_NO_OF_BENEFICIARIES_TOOLTIP')}
          />
          <DataCard
            title={tv('SUCCESSFUL_TRANSACTIONS')}
            smallNumber={formatNum(payout?.totalSuccessRequests ?? 0)}
            className="rounded-sm h-[80px] pt-10 pb-8 "
            infoIcon={true}
            infoTooltip={tv('SUCCESSFUL_TRANSACTIONS_TOOLTIP')}
          />
          <DataCard
            title={tv('FAILED_TRANSACTIONS')}
            smallNumber={formatNum(payout?.totalFailedPayoutRequests ?? 0)}
            className="rounded-sm h-[80px] pt-10 pb-8 "
            infoIcon={true}
            infoTooltip={tv('FAILED_TRANSACTIONS_TOOLTIP')}
          />
          <DataCard
            title={tv('PAYOUT_GAP')}
            smallNumber={formatNum(payout?.payoutGap ?? 0)}
            className="rounded-sm h-[80px] pt-10 pb-8 "
            infoIcon={true}
            infoTooltip={tv('PAYOUT_GAP_TOOLTIP')}
          />
        </div>
      </div>

      <div className="rounded-sm border border-gray-100 space-y-2 p-2 mt-2">
        <div className="flex gap-2">
          <SearchInput
            className="w-full flex-[4]"
            name={tv('SEARCH_BENEFICIARY_WALLET')}
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters?.search || ''}
          />

          {payout?.type === 'FSP' &&
            payout?.extras?.paymentProviderType !== 'manual_bank_transfer' && (
              <SelectComponent
                name={tv('TRANSACTION_TYPE')}
                options={[
                  'ALL',
                  'TOKEN_TRANSFER',
                  'FIAT_TRANSFER',
                  'VENDOR_REIMBURSEMENT',
                ]}
                labels={{
                  ALL: tg('ALL'),
                  TOKEN_TRANSFER: tg('TOKEN_TRANSFER'),
                  FIAT_TRANSFER: tg('FIAT_TRANSFER'),
                  VENDOR_REIMBURSEMENT: tg('VENDOR_REIMBURSEMENT'),
                }}
                onChange={(value) =>
                  handleFilterChange({
                    target: { name: 'transactionType', value },
                  })
                }
                value={filters?.transactionType || ''}
                className="flex-[1]"
              />
            )}

          <SelectComponent
            name={tg('STATUS')}
            options={
              getPayoutTransactionStatusOptions(
                payout?.type,
                payout?.extras?.paymentProviderType,
              ) as string[]
            }
            labels={{
              ALL: tg('ALL'),
              PENDING: tg('PENDING'),
              COMPLETED: tg('COMPLETED'),
              FAILED: tg('FAILED'),
              FIAT_TRANSACTION_INITIATED: tg('FIAT_TRANSACTION_INITIATED'),
              FIAT_TRANSACTION_COMPLETED: tg('FIAT_TRANSACTION_COMPLETED'),
              FIAT_TRANSACTION_FAILED: tg('FIAT_TRANSACTION_FAILED'),
              TOKEN_TRANSACTION_INITIATED: tg('TOKEN_TRANSACTION_INITIATED'),
              TOKEN_TRANSACTION_COMPLETED: tg('TOKEN_TRANSACTION_COMPLETED'),
              TOKEN_TRANSACTION_FAILED: tg('TOKEN_TRANSACTION_FAILED'),
            }}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'transactionStatus', value },
              })
            }
            value={filters?.transactionStatus || ''}
            className="flex-[1]"
          />
        </div>
        <DemoTable table={table} loading={payoutLogsLoading} />

        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          setPagination={setPagination}
          meta={
            (payoutlogs?.response?.meta as any) || {
              total: 0,
              currentPage: 0,
            }
          }
          perPage={pagination?.perPage}
          total={payoutlogs?.response?.meta?.total || 0}
        />
      </div>
    </div>
  );
}
