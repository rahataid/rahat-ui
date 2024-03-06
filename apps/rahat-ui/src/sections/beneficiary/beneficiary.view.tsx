'use client';
import { memo, useCallback, useMemo, useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { usePagination } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Beneficiary } from '@rahataid/sdk/types';
import { MoreHorizontal } from 'lucide-react';
import CustomPagination from '../../components/customPagination';
import { BENEFICIARY_NAV_ROUTE } from '../../const/beneficiary.const';
import { useRumsanService } from '../../providers/service.provider';
import BeneficiaryDetail from '../../sections/beneficiary/beneficiaryDetail';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import AddBeneficiary from './addBeneficiary';
import ImportBeneficiary from './import.beneficiary';

export const columns: ColumnDef<Beneficiary>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'walletAddress',
    header: 'Wallet Address',
    cell: ({ row }) => <div>{row.getValue('walletAddress')}</div>,
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <div>{row.getValue('gender')}</div>,
  },
  {
    accessorKey: 'internetStatus',
    header: 'Internet Access',
    cell: ({ row }) => <div>{row.getValue('internetStatus')}</div>,
  },
  {
    accessorKey: 'phoneStatus',
    header: 'Phone Type',
    cell: ({ row }) => <div>{row.getValue('phoneStatus')}</div>,
  },
  {
    accessorKey: 'bankedStatus',
    header: 'Banking Status',
    cell: ({ row }) => <div>{row.getValue('bankedStatus')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function BeneficiaryView() {
  const { pagination, filters, setPagination } = usePagination((state) => ({
    pagination: state.pagination,
    filters: state.filters,
    setPagination: state.setPagination,
  }));
  const handleNextPage = usePagination((state) => state.setNextPage);
  const handlePrevPage = usePagination((state) => state.setPrevPage);

  const { beneficiaryQuery } = useRumsanService();
  const [selectedData, setSelectedData] = useState<Beneficiary>();
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

  const handleBeneficiaryClick = useCallback((item: Beneficiary) => {
    setSelectedData(item);
  }, []);

  const handleNav = useCallback((item: string) => {
    setActive(item);
    setSelectedData(undefined);
  }, []);

  const handleDefault = useCallback(() => {
    setSelectedData(undefined);
  }, []);

  const queryOptions = useMemo(
    () => ({ ...pagination, ...filters }),
    [pagination, filters]
  );

  const { data } = beneficiaryQuery.useBeneficiaryList(queryOptions);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BeneficiaryNav handleNav={handleNav} meta={data?.meta} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === BENEFICIARY_NAV_ROUTE.ADD_BENEFICIARY ? (
            <AddBeneficiary />
          ) : active === BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY ? (
            <ImportBeneficiary />
          ) : null}

          {active === BENEFICIARY_NAV_ROUTE.DEFAULT && (
            <>
              <TabsContent value="list">
                <BeneficiaryListView
                  table={table}
                  meta={data?.meta}
                  handleClick={handleBeneficiaryClick}
                />
              </TabsContent>
              <TabsContent value="grid">
                <BeneficiaryGridView
                  handleClick={handleBeneficiaryClick}
                  data={data?.data}
                />
              </TabsContent>
              <CustomPagination
                meta={data?.response?.meta || { total: 0, currentPage: 0 }}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                handlePageSizeChange={(value) =>
                  setPagination({ perPage: Number(value) })
                }
              />
            </>
          )}
        </ResizablePanel>
        {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={28} defaultSize={28}>
              {selectedData && (
                <BeneficiaryDetail
                  data={selectedData}
                  handleDefault={handleDefault}
                />
              )}
              {/* {addBeneficiary && <AddBeneficiary />} */}
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </Tabs>
  );
}

export default memo(BeneficiaryView);