'use client';
import {
  useCambodiaBeneficiaries,
  usePagination,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { useCambodiaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import ViewColumns from '../../components/view.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudUpload, PlusIcon, UserRoundX } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();
  const debouncedSearch = useDebounce(filters, 500);

  const { data, isLoading } = useCambodiaBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
  });

  const processedData = {
    ...data,
    data: data?.data.map((benef) => ({
      ...benef,
      name: benef?.piiData?.name,
    })),
  };
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
  };
  const columns = useCambodiaBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: processedData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="p-4 bg-white ">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-semibold text-2xl mb-">Beneficiaries</h1>
            <p className="text-muted-foreground">
              Track all the beneficiaries here.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/projects/el-cambodia/${id}/beneficiary/discardedbenificary`}
            >
              <Button variant="outline">
                <UserRoundX className="mr-2 h-4 w-4" /> Discarded Beneficiaries
              </Button>
            </Link>
            {/* <Link href={`/projects/el-cambodia/${id}/beneficiary/upload`}>
              <Button variant="outline">
                <CloudUpload className="mr-2 h-4 w-4" /> Upload Beneficiaries
              </Button>
            </Link> */}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 ">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="name"
              className="w-[100%]"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ??
                filters?.name
              }
              onSearch={(event) => handleFilterChange(event)}
            />
            <div className="flex justify-between space-x-2 w-[40%]">
              <SelectComponent
                name="Type"
                options={['ALL', 'Sale', 'Lead']}
                onChange={(value) =>
                  handleFilterChange({
                    target: { name: 'type', value },
                  })
                }
                value={filters?.type || ''}
              />
              {/* <Button>
                <PlusIcon />
                Add Beneficiary
              </Button>
              <ViewColumns table={table} /> */}
            </div>
          </div>
          <CambodiaTable table={table} loading={isLoading} />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={
          (processedData?.response?.meta as any) || { total: 0, currentPage: 0 }
        }
        perPage={pagination?.perPage}
        total={processedData?.response?.meta?.total || 0}
      />
    </>
  );
}
