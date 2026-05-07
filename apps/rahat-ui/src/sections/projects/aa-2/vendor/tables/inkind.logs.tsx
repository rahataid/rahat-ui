import React from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { DemoTable } from 'apps/rahat-ui/src/common/table';
import { SearchInput } from 'apps/rahat-ui/src/common/search.input';
import { CustomPagination, Heading } from 'apps/rahat-ui/src/common';
import { usePagination } from '@rahat-ui/query/utils/use-pagination';
import { useParams } from 'next/navigation';
import { useLogsDetailsByVendor } from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { useDebounce } from '@rahat-ui/shadcn/src/components/custom/multi-select';
import { useInkindLogsColumn } from '../columns/useInkindlogsColumn';
import { InKindLog } from '../types';
import { PaginatedResult } from '@rumsan/sdk/types';

export default function InKindLogs() {
  const { id, vendorId }: { id: UUID; vendorId: UUID } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);

  const { data: logsData, isLoading } = useLogsDetailsByVendor({
    projectUuid: id,
    vendorId: vendorId,
    page: pagination.page,
    perPage: pagination.perPage,
    search: debounceSearch.walletAddress,
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  const columns = useInkindLogsColumn();
  const table = useReactTable({
    manualPagination: true,
    data: logsData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <Heading
        title="In-kind Logs"
        titleStyle="text-lg"
        description="List of all in-kind transactions"
      />

      {isLoading ? (
        <div className="w-full">
          <Loader />
        </div>
      ) : (
        <>
          <SearchInput
            name="walletAddress"
            onSearch={(e) => handleSearch(e, 'walletAddress')}
            value={filters?.walletAddress || ''}
            placeholder="Search wallet"
          />
          <DemoTable
            table={table}
            tableHeight={'h-[calc(400px)]'}
            loading={isLoading}
          />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            meta={logsData?.meta as PaginatedResult<InKindLog>['meta']}
            perPage={pagination?.perPage}
            total={logsData?.meta?.total || 0}
          />
        </>
      )}
    </div>
  );
}
