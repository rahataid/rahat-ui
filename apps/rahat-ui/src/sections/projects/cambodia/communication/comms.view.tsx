import { useCambodiaCommsList, usePagination } from '@rahat-ui/query';
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
import AddButton from '../../components/add.btn';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import ViewColumns from '../../components/view.columns';
import CambodiaTable from '../table.component';
import { useTableColumns } from './use.table.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

const cardData = [
  { title: 'Total Message Sent', icon: 'MessageSquareText', total: 0 },
  { title: 'Failed Message Delivery', icon: 'MessageSquareText', total: 0 },
  {
    title: 'Successfull Messages Delivered',
    icon: 'CircleCheck',
    total: 0,
  },
];

export default function CommunicationView() {
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

  const { data, isLoading } = useCambodiaCommsList({
    projectUUID: id,
  });
  const columns = useTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Communication</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cardData?.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={index} className="rounded-md border bg-card p-4 shadow">
                <div className="flex justify-between items-center">
                  <h1 className="text-base font-medium mb-1">{item.title}</h1>
                  <Icon />
                </div>
                <p className="text-primary font-semibold text-xl">
                  {item.total}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput className="w-full" name="" onSearch={() => {}} />
            <ViewColumns table={table} />
            {/* <AddButton
              path={`/projects/el-cambodia/${id}/communication/add`}
              name="SMS"
            /> */}
          </div>
          <CambodiaTable
            table={table}
            tableHeight="h-[calc(100vh-376px)]"
            loading={isLoading}
          />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(data?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={0}
      />
    </>
  );
}
