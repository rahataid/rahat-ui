'use client';
import React, { useCallback, useState } from 'react';

import GroupList from './list.group';
import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import BenificiaryNav from '../beneficiary/nav';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useCommunityGroupList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
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
    header: 'ID',
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
  const [selectedData, setSelectedData] = useState<ListGroup>();
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data } = useCommunityGroupList(pagination);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  const handleGroup = useCallback((item: ListGroup) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <Tabs defaultValue="groupList" className="h-full">
      <ResizablePanelGroup
        direction={'horizontal'}
        className="min-h-max bg-card"
      >
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BenificiaryNav meta={data?.response?.meta} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={25}>
          <TabsContent value="groupList">
            <GroupList table={table} handleClick={handleGroup} />
          </TabsContent>
          <CustomPagination
            meta={data?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={data?.response?.meta.lastPage || 0}
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
    </Tabs>
  );
}

export default ViewGroup;
