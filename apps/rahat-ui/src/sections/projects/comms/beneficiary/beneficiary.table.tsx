'use client';

import {
  genderOptions,
} from 'apps/rahat-ui/src/constants/selectOptionsRpBeneficiary';
import {
  PROJECT_SETTINGS_KEYS,
  useBeneficiaryStore,
  useBulkAssignClaimsToBeneficiaries,
  usePagination,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { UUID } from 'crypto';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import FiltersTags from '../../components/filtersTags';
import BulkAssignToken from './bulk-assign-token.modal';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Button } from '@rahat-ui/shadcn/components/button';
import { useCvaBeneficiaryTableColumns } from './use.table.column';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function BeneficiaryTable() {
  const bulkAssignTokens = useBulkAssignClaimsToBeneficiaries();

  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state?.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] as any,
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
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
  const columns = useCvaBeneficiaryTableColumns();
  const router = useRouter();

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow, index, parent) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  const selectedRowAddresses = Object.keys(selectedListItems);

  const handleBulkAssignTokens = async (numberOfTokens: string) => {
    await bulkAssignTokens.mutateAsync({
      beneficiaryAddresses: selectedRowAddresses as any,
      tokenAmount: numberOfTokens,
      projectAddress: contractSettings?.rpproject.address,
    });
  };

  return (
    <>
      <div className="w-full p-2 bg-secondary">
        <div className="flex items-center justify-between">
          {selectedRowAddresses.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  // disabled={assignVoucher.isPending}
                  className="h-10 ml-2"
                >
                  {selectedRowAddresses.length} - Beneficiary Selected
                  <ChevronDown strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="flex flex-col p-3 gap-2"
              >
                <BulkAssignToken
                  loading={bulkAssignTokens.isPending}
                  beneficiaries={selectedRowAddresses.length}
                  handleSubmit={handleBulkAssignTokens}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="grid grid-cols-6 gap-x-2 mb-3">
        
          <Select
            onValueChange={(value) => {
              table.getColumn('gender')?.setFilterValue(value);
            }}
            value={
              (table.getColumn('gender')?.getFilterValue() as string) ?? ''
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select Gender`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {genderOptions.map(({ value, label }: any) => (
                  <SelectItem value={value}>{label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
         
          <div className="col-span-2">
            <Input
              placeholder="Search Beneficiaries..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="rounded mr-2"
            />
          </div>
        </div>
        {Object.keys(filters).length != 0 && (
          <FiltersTags
            filters={filters}
            setFilters={setFilters}
            total={beneficiaries.data.data.length}
          />
        )}
        <div className="rounded-md border bg-card">
          <>
            <TableComponent>
              <ScrollArea className="h-[calc(100vh-190px)]">
                <TableHeader className="bg-card sticky top-0">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {beneficiaries.isFetching ? (
                          <TableLoader />
                        ) : (
                          <div className="w-full h-[calc(100vh-140px)]">
                            <div className="flex flex-col items-center justify-center">
                              <Image
                                src="/noData.png"
                                height={250}
                                width={250}
                                alt="no data"
                              />
                              <p className="text-medium text-base mb-1">
                                No Data Available
                              </p>
                              <p className="text-sm mb-4 text-gray-500">
                                There are no beneficiaries to display at the
                                moment
                              </p>
                              <Button
                                onClick={() =>
                                  router.push(
                                    `/projects/rp/${id}/beneficiary/add`,
                                  )
                                }
                              >
                                {' '}
                                <Plus
                                  className="mr-2"
                                  size={20}
                                  strokeWidth={1.5}
                                />
                                Add Beneficiary Data
                              </Button>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </ScrollArea>
            </TableComponent>
            <CustomPagination
              currentPage={pagination.page}
              handleNextPage={setNextPage}
              handlePageSizeChange={setPerPage}
              handlePrevPage={setPrevPage}
              perPage={pagination.perPage}
              meta={meta || { total: 0, currentPage: 0 }}
            />
          </>
        </div>
      </div>
    </>
  );
}
