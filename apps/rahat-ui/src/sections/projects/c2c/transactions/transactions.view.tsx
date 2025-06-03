'use client';

import {
  PROJECT_SETTINGS_KEYS,
  TransactionDetails,
  usePagination,
  useProjectSettingsStore,
  useTokenDetails,
} from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useQuery } from 'urql';
import { DataTablePagination } from './dataTablePagination';
import { Transaction, TransactionsObject } from './types';
import useTransactionColumn from './useTransactionColumn';
import { mergeTransactions } from './utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useQuery as useAPIQuery, useRSQuery } from '@rumsan/react-query';

export default function TransactionView() {
  const { id } = useParams();
  const tokenDetails = useTokenDetails();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [transactionList, setTransactionList] = React.useState<Transaction[]>(
    [],
  );

  console.log('transactionList', transactionList);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10); // State for rows per page
  const columns = useTransactionColumn();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { setPerPage } = usePagination();
  const { rumsanService, queryClient } = useRSQuery();

  const [rowSelection, setRowSelection] = React.useState({});

  const { data: offrampTransactions } = useAPIQuery(
    {
      queryKey: ['offramp-transacitons-list'],
      queryFn: async () => {
        const r = await rumsanService.client.get('/offramps/transactions');
        return r?.data?.data || [];
      },
    },
    queryClient,
  );

  console.log('first', offrampTransactions);

  const table = useReactTable({
    data: transactionList || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const safeWallet = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.SAFE_WALLET],
  );
  const contractAddress = contractSettings?.c2cproject?.address;

  const [result] = useQuery({
    query: TransactionDetails,
    variables: {
      contractAddress,
    },
    pause: !contractAddress,
  });

  console.log('tokenDetails', tokenDetails);

  React.useEffect(() => {
    (async () => {
      const transactionsObject: TransactionsObject = result.data;
      const transactionLists = await mergeTransactions(
        transactionsObject,
        contractAddress,
        tokenDetails,
      );
      console.log('transactionLists', transactionLists);
      setTransactionList(transactionLists);
    })();
  }, [result.data]);

  // Update rows per page whenever `rowsPerPage` changes
  React.useEffect(() => {
    setPerPage(rowsPerPage);
  }, [rowsPerPage, setPerPage]);

  return (
    <Tabs defaultChecked defaultValue="all-transactions">
      <div className="flex justify-between items-center p-4 pb-0">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="all-transactions"
            className="w-full data-[state=active]:bg-white"
            value="all-transactions"
          >
            Chain Transactions
          </TabsTrigger>
          <TabsTrigger
            id="offramp-transactions"
            className="w-full data-[state=active]:bg-white"
            value="offramp-transactions"
          >
            Offramp Transactions
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="p-2 bg-secondary">
        {/* <div className="flex justify-between items-center mb-2">
          <Input
            placeholder="Filter topics..."
            value={(table.getColumn('topic')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('topic')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div> */}
        <TabsContent value="all-transactions">
          <div className="rounded border bg-card">
            <Table>
              <ScrollArea className="h-[calc(100vh-180px)]">
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
                  {result.fetching ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <TableLoader />
                      </TableCell>
                    </TableRow>
                  ) : transactionList.length ? (
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
                              There are no transactions to display at the moment
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </ScrollArea>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </TabsContent>
        <TabsContent value="offramp-transactions">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Offramp Transactions</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <th className="border p-2 text-left">Transaction Hash</th> */}
                  <TableHead className="border p-2 text-left">
                    Beneficiary
                  </TableHead>
                  <TableHead className="border p-2 text-left">
                    Crypto Sent
                  </TableHead>
                  <TableHead className="border p-2 text-left">
                    Fiat Received
                  </TableHead>
                  <TableHead className="border p-2 text-left">Chain</TableHead>
                  <TableHead className="border p-2 text-left">Status</TableHead>

                  <TableHead className="border p-2 text-left">
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offrampTransactions?.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-gray-50">
                    <TableCell
                      className="border p-2"
                      title={tx?.extras?.senderAddress}
                    >
                      {tx?.extras?.senderAddress}
                    </TableCell>
                    <TableCell className="border p-2">
                      {tx.extras?.cryptoAmount} {tx?.token}
                    </TableCell>
                    <TableCell className="border p-2">
                      {tx.extras?.fiatTransactionAmount.toFixed(2)}{' '}
                      {tx.extras?.fiatCurrency}
                    </TableCell>
                    <TableCell className="border p-2">{tx?.chain}</TableCell>

                    <TableCell className="border p-2">{tx?.status}</TableCell>
                    <TableCell className="border p-2">
                      {new Date(tx?.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
