'use client';
import {
  useGetPayoutLogs,
  usePagination,
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
import { RotateCcw, Store, Ticket, Users } from 'lucide-react';
import BeneficiariesGroupTable from './beneficiariesGroupTable';
import PayoutConfirmationDialog from './payoutTriggerConfirmationModel';
import useBeneficiaryGroupDetailsLogColumns from './useBeneficiaryGroupDetailsLogColumns';
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
      label: 'Total no, of Beneficiaries',
      value:
        payout?.beneficiaryGroupToken?.beneficiaryGroup?._count
          ?.beneficiaries ?? 0,
      infoIcon: true,
      infoToolTip: 'This shows the total number of beneficiaries',
    },
    {
      label: 'Total Amount Disbursed',
      value: payout?.beneficiaryGroupToken?.numberOfTokens * ONE_TOKEN_VALUE,
      infoIcon: true,
      infoToolTip: 'This shows the total number of amount disbursed',
    },
  ];

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  console.log(payout);
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
          {payout?.type === 'FSP' && (
            <div className="flex gap-2">
              <PayoutConfirmationDialog
                onConfirm={() => handleTriggerPayout()}
                payoutData={payout}
              />
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
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4`}
        >
          {payoutStats?.map((item) => (
            <DataCard
              key={item.label}
              title={item.label}
              number={item.value}
              className="rounded-sm h-24 pt-2"
              infoIcon={item.infoIcon}
              infoTooltip={item.infoToolTip}
            />
          ))}
          <DataCard
            title="Payout Type"
            infoIcon={true}
            infoTooltip="This shows the payout type"
            smallNumber={payout?.type === 'VENDOR' ? 'CVA' : payout?.type}
            className="rounded-sm h-24"
            badge
          />
          <DataCard
            title="Payout Method"
            infoIcon={true}
            infoTooltip="This shows the payout method"
            smallNumber={
              payout?.type === 'VENDOR'
                ? payout?.mode
                : payout?.extras?.paymentProviderName
            }
            className="rounded-sm h-24"
            badge
          />

          {payout?.type === 'VENDOR' && payout?.mode === 'OFFLINE' && (
            <DataCard
              title="Vendor"
              infoIcon={true}
              infoTooltip="This shows the vendor name"
              smallNumber={payout?.extras?.vendorName}
              className="rounded-sm h-24"
              badge
            />
          )}
          <DataCard
            title="Successful Transaction"
            number={payout?.totalSuccessRequests}
            className="rounded-sm h-24"
            infoIcon={true}
            infoTooltip="This shows the total success transaction"
          />
          <DataCard
            title="Failed Transaction"
            number={payout?.totalFailedPayoutRequests}
            className="rounded-sm h-24"
            infoIcon={true}
            infoTooltip="This shows the total failed transaction"
          />
          <DataCard
            title="Payout Gap"
            number={payout?.payoutGap}
            className="rounded-sm h-24"
            infoIcon={true}
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
