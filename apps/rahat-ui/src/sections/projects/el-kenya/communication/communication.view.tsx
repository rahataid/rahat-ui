import { usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useElkenyaSMSTableColumns } from './use.sms.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import ViewColumns from '../../components/view.columns';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Settings } from 'lucide-react';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

const cardData = [
  { title: 'Total Message Sent', icon: 'MessageSquare', total: '1439' },
  { title: 'Failed Message Delivery', icon: 'MessageSquare', total: '1439' },
  {
    title: 'Successfull Messages Delivered',
    icon: 'CircleCheck',
    total: '1439',
  },
];

export default function CommunicationView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
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

  const columns = useElkenyaSMSTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [
      { date: '123', status: 'A1' },
      { date: '456', status: 'B1' },
    ],
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
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Communication</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cardData?.map((item, index) => {
            const Icon = getIcon(item.icon as any);
            return (
              // <div key={index} className="rounded-sm bg-card p-4 shadow-md">
              //   <div className="flex justify-between items-center">
              //     <h1 className="text-sm">{item.title}</h1>
              //     <div className="p-1 rounded-full bg-secondary text-primary">
              //       <Icon size={16} strokeWidth={2.5} />
              //     </div>
              //   </div>
              //   <p className="text-primary font-semibold text-xl">
              //     {item.total}
              //   </p>
              // </div>
              <DataCard
                className="border-solid rounded-sm"
                iconStyle="text-muted-foreground bg-white "
                key={index}
                title={item.title}
                Icon={Icon}
                number={item.total}
              />
            );
          })}
        </div>

        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput className="w-full" name="" onSearch={() => { }} />
            <ViewColumns table={table} />
            <Button
              onClick={() =>
                router.push(`/projects/el-kenya/${id}/communication/manage`)
              }
            >
              <Settings className="mr-1" size={18} /> Manage
            </Button>
          </div>
          <ElkenyaTable table={table} tableHeight="h-[calc(100vh-415px)]" />
        </div>
      </div>
      <CustomPagination
        meta={{ total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
}
