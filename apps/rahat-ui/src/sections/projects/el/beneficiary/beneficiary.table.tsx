'use client';

import {
  PROJECT_SETTINGS_KEYS,
  usePagination,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Tabs, TabsList, TabsTrigger } from '@rahat-ui/shadcn/components/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useBulkAssignVoucher } from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';
import { UUID } from 'crypto';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import TableLoader from '../../../../components/table.loader';
import { useBoolean } from '../../../../hooks/use-boolean';
import TokenAssingnConfirm from './token.assign.confirm';
import { useProjectBeneficiaryTableColumns } from './use-table-column';
import { useSecondPanel } from '../../../../providers/second-panel-provider';

export type Transaction = {
  name: string;
  beneficaryType: string;
  timeStamp: string;
  transactionHash: string;
  amount: string;
};


export const voucherType = [
  {
    key: 'NOT_ASSIGNED',
    value: 'NOT_ASSIGNED',
  },
  {
    key: 'FREE',
    value: 'FREE',
  },
  {
    key: 'REFERRED',
    value: 'REFERRED',
  },
];

function BeneficiaryDetailTableView() {
  const tokenAssignModal = useBoolean();
  const route = useRouter();
  const id = useParams();
  const { closeSecondPanel } = useSecondPanel();
  // TODO: Refactor it
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const handleTokenAssignModal = () => {
    tokenAssignModal.onTrue();
  };

  const handleTokenAssignModalClose = () => {
    tokenAssignModal.onFalse();
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const uuid = useParams().id as UUID;
  const {
    pagination,
    filters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
    setPagination,
  } = usePagination();
  const assignVoucher = useBulkAssignVoucher();

  const params = useSearchParams().get('voucherType');
  const [voucherType, setVoucherType] = useState('NOT_ASSIGNED');

  useEffect(() => {
    if (params) {
      setVoucherType(params);
    }
  }, [params]);

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    type: voucherType,
    projectUUID: uuid,
    ...filters,
  });

  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [isTransacting, setisTransacting] = useState<boolean>(false);

  const contractAddress = useProjectSettingsStore(
    (state) => state.settings?.[uuid][PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const columns = useProjectBeneficiaryTableColumns(voucherType, projectBeneficiaries);

 

  const table = useReactTable({
    manualPagination: true,
    data: projectBeneficiaries?.data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.walletAddress,
    onRowSelectionChange: setSelectedListItems,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const selectedRowAddresses = Object.keys(selectedListItems);

  const result = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  useEffect(() => {
    if(result?.data){
      setisTransacting(false);
      setVoucherType('FREE_VOUCHER');
      projectBeneficiaries.refetch();
    }
  }, [result.isFetching]);

  const handleBulkAssign = async () => {
    setisTransacting(true);
    try {
      const txnHash = await assignVoucher.mutateAsync({
        addresses: selectedRowAddresses as `0x${string}`[],
        noOfTokens: 1,
        contractAddress: contractAddress.elproject.address,
      });
      setTransactionHash(txnHash as `0x-${string}`);
      handleTokenAssignModalClose();
    } catch (err) {
      setisTransacting(false);
      handleTokenAssignModalClose();
    }
  };

  useEffect(() => {
    if (assignVoucher.isSuccess) {
      route.push(`/projects/el/${id}`);
    }

    if (assignVoucher.isError) {
      setisTransacting(false);
    }
  }, []);

  return (
    <>
      <div className="p-2 bg-card">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded mr-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {selectedRowAddresses.length ? (
                <Button
                  disabled={assignVoucher.isPending}
                  className="h-10 ml-2"
                >
                  {selectedRowAddresses.length} - Beneficiary Selected
                  <ChevronDown strokeWidth={1.5} />
                </Button>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTokenAssignModal}>
                Assign Vouchers To All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Tabs value={voucherType} className="w-full mb-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                onClick={() => {
                  setVoucherType('NOT_ASSIGNED');
                  resetSelectedListItems();
                  setPagination({page: 1, perPage: pagination.perPage})
                  closeSecondPanel();
                }}
                value="NOT_ASSIGNED"
              >
                Not Assigned
              </TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  setVoucherType('FREE_VOUCHER');
                  setPagination({page: 1, perPage: pagination.perPage})
                  resetSelectedListItems();
                  closeSecondPanel();
                }}
                value="FREE_VOUCHER"
              >
                Free Voucher
              </TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  setVoucherType('DISCOUNT_VOUCHER');
                  setPagination({page: 1, perPage: pagination.perPage})
                  resetSelectedListItems();
                  closeSecondPanel();
                }}
                value="DISCOUNT_VOUCHER"
              >
                Discount Voucher
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div></div>
        <div className="rounded border bg-card">
          <Table>
            <ScrollArea className="h-[calc(100vh-220px)]">
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
                      {projectBeneficiaries.isFetching ? (
                        <TableLoader />
                      ) : (
                        'No data available.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePageSizeChange={setPerPage}
        handlePrevPage={setPrevPage}
        meta={projectBeneficiaries.data?.response?.meta || {}}
        perPage={pagination.perPage}
      />
      <TokenAssingnConfirm
        tokens={selectedRowAddresses.length}
        open={tokenAssignModal.value}
        handleClose={handleTokenAssignModalClose}
        handleSubmit={handleBulkAssign}
        isTransacting={isTransacting}
      />
    </>
  );
}

export default React.memo(BeneficiaryDetailTableView);
