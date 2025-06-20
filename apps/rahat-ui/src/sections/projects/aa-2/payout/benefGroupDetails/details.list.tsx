'use client';
import {
  useGetPayoutLogs,
  usePagination,
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
  Heading,
  SearchInput,
  TableLoader,
} from 'apps/rahat-ui/src/common';

import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { UUID } from 'crypto';
import { RotateCcw, Ticket, Users } from 'lucide-react';
import BeneficiariesGroupTable from './beneficiariesGroupTable';
import useBeneficiaryGroupDetailsLogColumns from './useBeneficiaryGroupDetailsLogColumns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import PayoutConfirmationDialog from './payoutTriggerConfirmationModel';
import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';

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

  const router = useRouter();

  const { data: payout, isLoading } = useSinglePayout(projectId, {
    uuid: payoutId,
  });

  const { data: payoutlogs, isLoading: payoutLogsLoading } = useGetPayoutLogs(
    projectId,
    {
      payoutUUID: payoutId,
      ...pagination,
    },
  );
  const triggerForPayoutFailed = useTriggerForPayoutFailed();
  const triggerPayout = useTriggerPayout();
  const columns = useBeneficiaryGroupDetailsLogColumns();

  const tableData = React.useMemo(() => {
    const benefs =
      payout?.beneficiaryGroupToken?.beneficiaryGroup?.beneficiaries ?? [];
    const data = benefs?.length
      ? benefs?.map((b: any) => ({
          walletAddress: 'N/A',
          transactionWalletId: 'N/A',
          bankTransactionId: 'N/A',
          tokensAssigned: 'N/A',
          status: 'N/A',
          timeStamp: b?.updatedAt,
        }))
      : [];
    return data;
  }, [payout]);

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
      label: 'Total Beneficiaries',
      value:
        payout?.beneficiaryGroupToken?.beneficiaryGroup?._count
          ?.beneficiaries ?? 0,
      icon: Users,
    },
    {
      label: 'Total Tokens',
      value: payout?.beneficiaryGroupToken?.numberOfTokens,
      icon: Ticket,
    },
  ];

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
              status={payout?.isCompleted ? 'Completed' : 'Not Completed'}
              badgeClassName={isCompleteBgStatus(payout?.isCompleted)}
            />
          </div>
          <div className="flex gap-2">
            <PayoutConfirmationDialog
              onConfirm={() => handleTriggerPayout()}
              payoutData={payout}
            />

            <Button
              className={`gap-2 text-sm ${
                payout?.hasFailedPayoutRequests === false && 'hidden'
              }`}
              onClick={handleTriggerPayoutFailed}
            >
              <RotateCcw className="w-4 h-4" />
              Retry Failed Requests
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {payoutStats?.map((item) => (
            <DataCard
              key={item.label}
              title={item.label}
              Icon={item.icon}
              number={item.value}
              className="rounded-sm"
            />
          ))}
          <DataCard
            title="Payout Mode"
            Icon={Ticket}
            smallNumber={payout?.type}
            className="rounded-sm"
            badge
          />
          <DataCard
            title="Payout Mode"
            Icon={Ticket}
            smallNumber={payout?.extras?.paymentProviderName}
            className="rounded-sm"
            badge
          />
        </div>
      </div>

      <div className="rounded-sm border border-gray-100 space-y-2 p-4 mt-2">
        <div className="flex gap-2">
          <SearchInput
            name="walletAddress"
            className="w-full flex-[4]"
            value={
              (table.getColumn('walletAddress')?.getFilterValue() as string) ??
              filters?.walletAddress
            }
            onSearch={(event) => handleFilterChange(event)}
          />
          <SelectComponent
            name="Status"
            options={['ALL', 'COMPLETED', 'PENDING', 'REJECTED']}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'status', value },
              })
            }
            value={filters?.status || ''}
            className="flex-[1]"
          />
        </div>
        <BeneficiariesGroupTable table={table} loading={isLoading} />
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
