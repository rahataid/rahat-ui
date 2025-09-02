'use client';
import {
  CustomPagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { memo, useCallback, useEffect, useState } from 'react';
import useTransactionHistoryTableColumns from './useTransactionHistoryTableColumns';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  usePagination,
  useProjectSettingsStore,
  PROJECT_SETTINGS_KEYS,
  TransactionDetails,
} from '@rahat-ui/query';
import { useQuery } from 'urql';
import { TransactionsObject } from '../../c2c/beneficiary/types';
import { mergeTransactions } from '@rahat-ui/query/lib/c2c/utils';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { set } from 'lodash';

const TransactionHistory = () => {
  const [transactionList, setTransactionList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const uuid = useParams().id as UUID;

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const contractAddress = contractSettings?.c2cproject?.address;

  const {
    pagination,
    filters,
    setNextPage,
    setPrevPage,
    setPerPage,
    setFilters,
    setPagination,
  } = usePagination();

  // Calculate skip value for GraphQL pagination
  const skip = (pagination.page - 1) * pagination.perPage;

  const [{ data, fetching, error }] = useQuery({
    query: TransactionDetails,
    variables: {
      contractAddress,
      to: filters.search || '',
      first: pagination.perPage,
      skip: skip,
    },
    pause: !contractAddress,
  });

  const columns = useTransactionHistoryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: transactionList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
      // Reset pagination when searching
      setPagination({ ...pagination, page: 1 });
    },
    [filters, setFilters, setPagination, pagination],
  );

  useEffect(() => {
    if (data) {
      (async () => {
        const transactionsObject: TransactionsObject = data;
        const transactionLists = await mergeTransactions(transactionsObject);
        setTransactionList(transactionLists);

        // Calculate total count from both transfers and transferProcesseds
        const transfersCount = data.transfersCount?.length || 0;
        const transferProcessedsCount =
          data.transferProcessedsCount?.length || 0;
        setTotalCount(transfersCount + transferProcessedsCount);
      })();
    }
  }, [data]);

  return (
    <div className="p-4">
      <Heading
        title="Transaction History"
        description="List of all your transactions history"
      />

      <div className="rounded-sm border">
        <div className="p-2">
          <SearchInput
            className="w-full"
            name="by wallet address"
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters.search}
          />
        </div>

        <DemoTable
          table={table}
          loading={fetching}
          message={'No transactions found available'}
          height="280px"
        />
        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          setPagination={setPagination}
          perPage={pagination.perPage}
          total={totalCount}
          meta={{
            total: totalCount,
            lastPage: Math.ceil(totalCount / pagination.perPage),
            currentPage: pagination.page,
            perPage: pagination.perPage,
            prev: pagination.page > 1 ? pagination.page - 1 : null,
            next:
              pagination.page < Math.ceil(totalCount / pagination.perPage)
                ? pagination.page + 1
                : null,
          }}
        />
      </div>
    </div>
  );
};

export default memo(TransactionHistory);
