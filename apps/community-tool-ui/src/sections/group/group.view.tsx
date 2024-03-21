import React, { useCallback, useState } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';

import AddGroup from './add.group';
import GroupList from './list.group';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRumsanService } from '../../providers/service.provider';
import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Eye } from 'lucide-react';
import GroupDetail from './groupdetails';
import CustomPagination from '../../components/customPagination';
const columns: ColumnDef<ListGroup>[] = [
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
    header: 'id',
    accessorKey: 'ID',
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    id: 'actions',

    enableHiding: false,
    cell: () => {
      return (
        <Eye
          size={20}
          strokeWidth={1.5}
          className="cursor-pointer hover:text-primary"
        />
      );
    },
  },
];
function ViewGroup() {
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedData, setSelectedData] = useState<ListGroup>();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const { communityGroupQuery } = useRumsanService();
  const { data } = communityGroupQuery.useCommunityGroupList({
    perPage,
    page: currentPage,
  });

  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id.toString(),
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  const handleGroup = useCallback((item: ListGroup) => {
    console.log('item', item);
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <Tabs defaultValue="list" className="p-4 h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">List</TabsTrigger>
        <TabsTrigger value="add">ADD</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <ResizablePanelGroup direction={'horizontal'}>
          <ResizablePanel minSize={25}>
            <GroupList table={table} handleClick={handleGroup} />
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
              <ResizablePanel minSize={80} defaultSize={75}>
                <GroupDetail handleClose={handleClose} data={selectedData} />
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </TabsContent>
      <TabsContent value="add">
        <AddGroup />
      </TabsContent>
    </Tabs>
  );
}

export default ViewGroup;
