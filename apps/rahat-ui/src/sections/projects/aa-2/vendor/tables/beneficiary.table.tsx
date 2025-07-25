import {
  PayoutMode,
  useGetVendorBeneficiaries,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { DemoTable, Heading, SearchInput } from 'apps/rahat-ui/src/common';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { useVendorsBeneficiaryTableColumns } from '../columns/useBeneficiaryColumns';

interface VendorsBeneficiaryListProps {
  beneficiaryData?: {
    success: boolean;
    data: any[];
    meta: any;
  };
  loading?: boolean;
}

export default function VendorsBeneficiaryList({
  beneficiaryData,
  loading,
}: VendorsBeneficiaryListProps) {
  const { id, vendorId } = useParams();

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
    resetSelectedListItems,
  } = usePagination();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { data, isLoading } = useGetVendorBeneficiaries({
    projectUUID: id,
    vendorUuid: vendorId,
    payoutMode: PayoutMode.OFFLINE,
    ...pagination,
    ...filters,
  });

  const tableData = useMemo(() => {
    if (data?.response?.data?.length > 0) {
      return data?.response?.data?.map((beneficiary: any) => {
        return {
          name: beneficiary?.name,
          benTokens: beneficiary?.benTokens,
          walletAddress: beneficiary?.walletAddress,
          uuid: beneficiary?.uuid,
        };
      });
    } else {
      return [];
    }
  }, [data?.response?.data]);
  const columns = useVendorsBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className="space-y-2">
      <Heading
        title="Offline Beneficiaries"
        titleStyle="text-lg"
        description="List of all the offline beneficiaries"
      />
      <SearchInput
        className="w-full"
        name=""
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
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
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      />
    </div>
  );
}
