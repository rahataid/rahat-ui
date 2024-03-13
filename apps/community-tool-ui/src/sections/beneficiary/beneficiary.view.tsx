'use client';
import { memo, useCallback, useState } from 'react';

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

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { MoreHorizontal } from 'lucide-react';
import CustomPagination from '../../components/customPagination';
import { BENEFICIARY_NAV_ROUTE } from '../../constants/beneficiary.const';
import { useRumsanService } from '../../providers/service.provider';
import BeneficiaryDetail from '../../sections/beneficiary/beneficiaryDetail';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import AddBeneficiary from './addBeneficiary';
import ImportBeneficiary from './import.beneficiary';

export const columns: ColumnDef<ListBeneficiary>[] = [
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
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const { communityBenQuery } = useRumsanService();
  const [selectedData, setSelectedData] = useState<ListBeneficiary>();
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

  const handleBeneficiaryClick = useCallback((item: ListBeneficiary) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  const handleNav = useCallback((item: string) => {
    setActive(item);
  }, []);

  const { data } = communityBenQuery.useCommunityBeneficiaryList({
    perPage,
    page: currentPage,
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
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
          <BeneficiaryNav handleNav={handleNav} meta={data?.response?.meta} />
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
                  handleClick={handleBeneficiaryClick}
                />
              </TabsContent>
              <TabsContent value="grid">
                <BeneficiaryGridView
                  handleClick={handleBeneficiaryClick}
                  data={data?.data}
                />
              </TabsContent>
            </>
          )}
          <CustomPagination
            meta={data?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handlePageSizeChange={(value) => setPerPage(Number(value))}
          />
        </ResizablePanel>
        {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={24}>
              {selectedData && (
                <BeneficiaryDetail
                  handleClose={handleClose}
                  data={selectedData}
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
