'use client';
import {
  useGetPayoutLogs,
  usePagination,
  usePayoutExportLogs,
  useSinglePayout,
  useTriggerForPayoutFailed,
  useTriggerPayout,
} from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams, useSearchParams } from 'next/navigation';
import * as React from 'react';

import {
  Back,
  CustomPagination,
  DataCard,
  Heading,
  SearchInput,
  TableLoader,
} from 'apps/rahat-ui/src/common';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { UUID } from 'crypto';
import {
  CloudDownload,
  RotateCcw,
  Ticket,
  User,
  StoreIcon,
} from 'lucide-react';
import BeneficiariesGroupTable from './beneficiariesGroupTable';
import PayoutConfirmationDialog from './payoutTriggerConfirmationModel';
import useBeneficiaryGroupDetailsLogColumns from './useBeneficiaryGroupDetailsLogColumns';
import * as XLSX from 'xlsx';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';

export default function BeneficiaryGroupTransactionDetailsList() {
  const params = useParams();
  const projectId = params.id as UUID;
  const payoutId = params.detailID as UUID;
  const searchParams = useSearchParams();

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
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportPayoutLogs);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FailedLogs');
    XLSX.writeFile(workbook, 'payout-logs.xlsx');
  };

  console.log('table', payoutlogs);
  console.log('single', payout);
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
      label: 'Total Actual Budget',
      smallNumber: `Rs. ${payout?.totalSuccessAmount}` ?? 0,
      infoIcon: payout?.type === 'VENDOR' ? false : true,
      infoToolTip: 'This shows the total number of budget',
      icon: payout?.type === 'VENDOR' ? User : undefined,
    },
    {
      label: 'Total amount disbursed in this payout',
      smallNumber: `Rs. ${
        payout?.beneficiaryGroupToken?.numberOfTokens * ONE_TOKEN_VALUE
      }`,
      infoIcon: payout?.type === 'VENDOR' ? false : true,
      infoToolTip: 'This shows the total number of amount disbursed',
      icon: payout?.type === 'VENDOR' ? Ticket : undefined,
    },
    {
      label: 'Type of Payout',
      infoIcon: payout?.type === 'VENDOR' ? false : true,
      infoTooltip: 'This shows the payout type',
      smallNumber: payout?.type === 'VENDOR' ? 'CVA' : payout?.type,
      badge: true,
      icon: payout?.type === 'VENDOR' ? Ticket : undefined,
    },
    {
      label: 'Payment Method',
      infoIcon: payout?.type === 'VENDOR' ? false : true,
      infoTooltip: 'This shows the payment method',
      smallNumber:
        payout?.type === 'VENDOR'
          ? payout?.mode
          : payout?.extras?.paymentProviderName,
      badge: true,
      icon: payout?.type === 'VENDOR' ? Ticket : undefined,
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
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectId}/payout/list`} />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`${payout?.beneficiaryGroupToken?.beneficiaryGroup?.name}`}
              description="List of all the payout transaction logs of selected group"
              status={payout?.status
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/^./, (char) => char.toUpperCase())}
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
                <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
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
                    Retry Failed Requests
                  </Button>
                </RoleAuth>
              )}
              <Button
                className={`gap-2 text-sm ${
                  payoutlogs?.data?.length < 0 && 'hidden'
                }`}
                onClick={handleDownload}
                variant={'outline'}
              >
                <CloudDownload className={`w-4 h-4`} />
                Download Payout Logs
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
              // number={item.value}
              className="rounded-sm h-[119px]"
              infoIcon={item.infoIcon}
              infoTooltip={item.infoToolTip}
              badge={item.badge}
              smallNumber={item.smallNumber}
              Icon={item.icon}
            />
          ))}

          {payout?.type === 'VENDOR' && payout?.mode === 'OFFLINE' && (
            <DataCard
              title="Vendor"
              infoIcon={false}
              infoTooltip="This shows the vendor name"
              smallNumber={payout?.extras?.vendorName}
              className="rounded-sm h-[119px]"
              badge
              Icon={StoreIcon}
            />
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-4 pt-4">
          <DataCard
            title="Total number of beneficiaries in the group"
            smallNumber={
              payout?.beneficiaryGroupToken?.beneficiaryGroup?._count
                ?.beneficiaries ?? 0
            }
            className="rounded-sm h-[119px]"
            infoIcon={true}
            infoTooltip="This shows the payout gap"
            Icon={payout?.type === 'VENDOR' ? User : undefined}
          />
          <DataCard
            title="Total number of Sucessful Transactions"
            smallNumber={payout?.totalSuccessRequests}
            className="rounded-sm h-[119px]"
            infoIcon={true}
            infoTooltip="This shows the total success transaction"
          />
          <DataCard
            title=" Total number of Failed Transactions"
            smallNumber={payout?.totalFailedPayoutRequests}
            className="rounded-sm h-[119px]"
            infoIcon={true}
            infoTooltip="This shows the total failed transaction"
          />
          <DataCard
            title="Gap between Activation phsae triggerd and payout disbursed"
            smallNumber={payout?.payoutGap}
            className="rounded-sm h-[119px]"
            infoIcon={false}
            infoTooltip="This shows the payout gap"
          />
        </div>
      </div>

      <div className="rounded-sm border border-gray-100 space-y-2 p-4 mt-2">
        <div className="flex gap-2">
          <SearchInput
            className="w-full flex-[4]"
            name="beneficiary wallet address"
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters?.search || ''}
          />

          {payout?.type === 'FSP' && (
            <SelectComponent
              name="Transaction Type"
              options={[
                'ALL',
                'TOKEN_TRANSFER',
                'FIAT_TRANSFER',
                'VENDOR_REIMBURSEMENT',
              ]}
              onChange={(value) =>
                handleFilterChange({
                  target: { name: 'transactionType', value },
                })
              }
              value={filters?.transactionType || ''}
              className="flex-[1]"
            />
          )}

          {payout?.type === 'FSP' ? (
            <SelectComponent
              name="Status"
              options={[
                'ALL',
                'PENDING',
                'TOKEN_TRANSACTION_INITIATED',
                'TOKEN_TRANSACTION_COMPLETED',
                'TOKEN_TRANSACTION_FAILED',
                'FIAT_TRANSACTION_INITIATED',
                'FIAT_TRANSACTION_COMPLETED',
                'FIAT_TRANSACTION_FAILED',
                'COMPLETED',
                'FAILED',
              ]}
              onChange={(value) =>
                handleFilterChange({
                  target: { name: 'transactionStatus', value },
                })
              }
              value={filters?.transactionStatus || ''}
              className="flex-[1]"
            />
          ) : (
            <SelectComponent
              name="Status"
              options={['ALL', 'PENDING', 'COMPLETED', 'FAILED']}
              onChange={(value) =>
                handleFilterChange({
                  target: { name: 'transactionStatus', value },
                })
              }
              value={filters?.transactionStatus || ''}
              className="flex-[1]"
            />
          )}
        </div>
        <BeneficiariesGroupTable table={table} loading={payoutLogsLoading} />
        <CustomPagination
          meta={
            payoutlogs?.response?.meta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={payoutlogs?.response?.meta?.total}
        />
      </div>
    </div>
  );
}
