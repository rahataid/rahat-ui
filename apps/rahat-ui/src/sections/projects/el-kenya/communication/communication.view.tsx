import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaSMSTableColumns } from './use.sms.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';

const cardData = [
  { title: 'Total Message Sent', icon: 'MessageSquare', total: 1439 },
  { title: 'Failed Message Delivery', icon: 'MessageSquare', total: 1439 },
  {
    title: 'Successfull Messages Delivered',
    icon: 'MessageSquare',
    total: 1439,
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

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;

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
      <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Communication</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cardData?.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={index} className="rounded-sm bg-card p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <h1 className="text-sm">{item.title}</h1>
                  <div className="p-1 rounded-full bg-secondary text-primary">
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
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
            <AddButton
              path={`/projects/el-kenya/${id}/communication/text/manage`}
              name="SMS"
            />
          </div>
          <ElkenyaTable table={table} />
        </div>
      </div>
    </>
  );
}
