import { useTranslations } from 'next-intl';
import { usePagination, usePayouts } from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import * as React from 'react';
import usePayoutTransactionLogTableColumn from './usePayoutTransactionLogTableColumn';

import {
  CustomPagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';

import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
export default function PayoutTransactionList() {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const { id: projectID } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);
  const { data: payouts, isLoading } = usePayouts(projectID as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    payoutType: debounceSearch.payoutType,
    groupName: debounceSearch.groupName,
  });

  const columns = usePayoutTransactionLogTableColumn();

  const tableData = React.useMemo(
    () =>
      payouts?.data?.length
        ? payouts?.data?.map((d: any) => ({
            uuid: d?.uuid,
            groupName: d?.beneficiaryGroupToken?.beneficiaryGroup?.name,
            totalBeneficiaries:
              d?.beneficiaryGroupToken?.beneficiaryGroup?._count?.beneficiaries,
            totalTokenAssigned: d?.beneficiaryGroupToken?.numberOfTokens,
            payoutType: d?.type,
            payoutMode:
              d?.type === 'FSP'
                ? d?.extras?.paymentProviderName || '-'
                : d?.mode,
            status: d?.status ?? 'N/A',
            timeStamp: d?.updatedAt,
            totalSuccessAmount: d?.totalSuccessAmount,
          }))
        : [],
    [payouts],
  );

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue =
        value === 'ALL' ? '' : value === 'CVA' ? 'VENDOR' : value;

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
  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-0">
        {/* <Back path={`/projects/aa/${projectID}/payout`} /> */}

        <div className=" flex justify-between items-center">
          <div>
            <Heading
              title={tv('PAYOUT_LIST')}
              description={tv('LIST_OF_YOUR_PAYOUTS')}
              titleStyle="font-medium text-lg"
            />
          </div>
        </div>
      </div>

      <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.PAYOUT}>
        <div className="rounded-sm border border-gray-100 space-y-2 p-4">
          <div className="flex gap-2">
            <SearchInput
              className="w-full flex-[4]"
              name={tv('GROUP_NAME')}
              onSearch={(e) => handleSearch(e, 'groupName')}
              value={filters?.groupName || ''}
            />
            <SelectComponent
              name={tv('PAYOUT_TYPE')}
              options={['ALL', 'FSP', 'CVA']}
              labels={{ ALL: tg('ALL'), FSP: tg('FSP'), CVA: tg('CVA') }}
              onChange={(value) =>
                handleFilterChange({
                  target: { name: 'payoutType', value },
                })
              }
              value={
                filters?.payoutType === 'VENDOR'
                  ? 'CVA'
                  : filters?.payoutType || ''
              }
              className="flex-[1]"
            />
          </div>
          <DemoTable table={table} loading={isLoading} />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            setPagination={setPagination}
            meta={
              (payouts?.response?.meta as any) || {
                total: 0,
                currentPage: 0,
              }
            }
            perPage={pagination?.perPage}
            total={payouts?.response?.meta?.total || 0}
          />
        </div>
      </ProjectPermissionGuard>
    </div>
  );
}
