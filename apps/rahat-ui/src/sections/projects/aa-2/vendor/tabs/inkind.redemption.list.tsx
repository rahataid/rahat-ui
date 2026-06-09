import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  IconLabelBtn,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import React, { useCallback, useEffect, useState } from 'react';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';
import { usePagination, useGetInkindRedemptionLogs } from '@rahat-ui/query';
import { useInkindRedemptionColumn } from '../columns/useInkindRedemptionColumn';
import { InkindType } from '../../inkindManagement/schemas/inkind.validation';
import * as XLSX from 'xlsx';

import { CloudDownloadIcon } from 'lucide-react';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';

export type InkindRedemptionData = {
  uuid: UUID;
  vendor: {
    name: string;
  };
  beneficiaryName: string;
  beneficiaryWallet: string;
  inkind: {
    name: string;
    type: InkindType;
  };
  quantity: number;
  approvedAt: Date;
  approvedBy: string;
  redemptionStatus: string;
  redeemedAt: string;
  transactionHash: string | null;
};

export const InkindRedemptionList = ({
  id,
  vendorId,
  showActions = true,
}: {
  id: UUID;
  vendorId?: UUID;
  showActions?: boolean;
}) => {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    filters,
    setFilters,
    pagination,
    setPerPage,
    setNextPage,
    setPrevPage,
    setPagination,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);

  const { data, isPending } = useGetInkindRedemptionLogs({
    projectUuid: id,
    ...pagination,
    ...(vendorId ? { vendorUuid: vendorId } : {}),
    vendorName: debounceSearch.vendorName,
    inkindName: debounceSearch.inkindName,
    status: filters.status,
    inkindType: filters.inkindType,
  });

  const queryData = data as any;

  const meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  } = queryData?.response?.meta || {
    total: 0,
    lastPage: 0,
    currentPage: 0,
    perPage: 0,
    prev: null,
    next: null,
  };

  const columns = useInkindRedemptionColumn(id, showActions);

  const [exportTrigger, setExportTrigger] = useState<UUID | undefined>();

  const exportQuery = useGetInkindRedemptionLogs({
    projectUuid: exportTrigger as UUID,
    page: 1,
    perPage: 100000,
    ...(vendorId ? { vendorUuid: vendorId } : {}),
    vendorName: filters.vendorName,
    inkindName: filters.inkindName,
    status: filters.status,
    inkindType: filters.inkindType,
  });

  const handleExport = useCallback(() => {
    if (!exportTrigger) setExportTrigger(id);
  }, [exportTrigger, id]);

  useEffect(() => {
    if (exportQuery.data && exportTrigger) {
      const rows = (exportQuery.data as any)?.data || [];
      if (rows.length > 0) {
        const flattened = rows.map((row: InkindRedemptionData) => ({
          'Vendor Name': row.vendor?.name || '',
          'Inkind Name': row.inkind?.name || '',
          'Inkind Type': row.inkind?.type || '',
          Quantity: row.quantity,
          'Approved At': row.approvedAt
            ? new Date(row.approvedAt).toISOString()
            : '',
          'Approved By': row.approvedBy || '',
          Status: row.redemptionStatus,
          'Tx Hash': row.transactionHash || '',
        }));
        const ws = XLSX.utils.json_to_sheet(flattened);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Redemptions');
        XLSX.writeFile(wb, 'vendor_inkind_redemption_logs.csv', {
          bookType: 'csv',
        });
      }
      setExportTrigger(undefined);
    }
  }, [exportQuery.data, exportTrigger]);

  const table = useReactTable({
    manualPagination: true,
    data: queryData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
      setPagination({ ...pagination, page: 1 });
    },
    [filters, pagination, setFilters, setPagination],
  );

  const handleFilterChange = React.useCallback(
    (filterName: string, value: string) => {
      const filterValue = value === 'ALL' ? '' : value;
      setFilters({ ...filters, [filterName]: filterValue });
      setPagination({ ...pagination, page: 1 });
    },
    [filters, pagination, setFilters, setPagination],
  );

  if (isPending) {
    return <SpinnerLoader />;
  }
  return (
    <div className="rounded border bg-card p-4">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full flex-[4]"
          name="vendor name"
          onSearch={(e) => handleSearch(e, 'vendorName')}
          value={filters?.vendorName || ''}
        />
        <SearchInput
          className="w-full flex-[4]"
          name="inkind name"
          onSearch={(e) => handleSearch(e, 'inkindName')}
          value={filters?.inkindName || ''}
        />
        <SelectComponent
          name="Status"
          options={['ALL', 'APPROVED', 'REQUESTED']}
          onChange={(value) => handleFilterChange('status', value)}
          value={
            ['REQUESTED', 'APPROVED'].includes(filters?.status)
              ? filters.status
              : ''
          }
          className="flex-[2]"
        />
        <SelectComponent
          name="Inkind Type"
          options={['ALL', 'PRE_DEFINED', 'WALK_IN']}
          onChange={(value) => handleFilterChange('inkindType', value)}
          value={
            ['PRE_DEFINED', 'WALK_IN'].includes(filters?.inkindType)
              ? filters.inkindType
              : ''
          }
          className="flex-[2]"
        />
        <div className="h-full">
          <TooltipWrapper
            tip={
              queryData?.data?.length
                ? 'Export to CSV'
                : 'No data available to export'
            }
          >
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              name="Export Logs"
              handleClick={handleExport}
              disabled={!queryData?.data?.length}
              variant="outline"
              className="cursor-pointer"
              size=""
            />
          </TooltipWrapper>
        </div>
      </div>
      <DemoTable
        table={table}
        tableHeight="h-[500px]"
        message="No In-kind Redemption Records"
        // loading={isPending}
      />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={meta}
        perPage={pagination.perPage}
        total={queryData?.response?.meta?.total || 0}
      />
    </div>
  );
};
