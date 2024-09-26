import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import useTableColumn from './use.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import HeaderWithBack from '../../components/header.with.back';
import AddButton from '../../components/add.btn';

const cardData = [
  {
    title: 'Checkup Status',
    label1: 'Checked',
    label2: 'Not Checked',
    sublabel1: 123,
    sublabel2: 45,
  },
  {
    title: 'Glassed Status',
    label1: 'Required',
    label2: 'Not Required',
    sublabel1: 123,
    sublabel2: 45,
  },
  {
    title: 'Voucher Type',
    label1: 'Single Vision',
    label2: 'Reading Glass',
    sublabel1: 123,
    sublabel2: 45,
  },
  {
    title: 'Voucher Status',
    label1: 'Redeemed',
    label2: 'Not Redeemed',
    sublabel1: 123,
    sublabel2: 45,
  },
];

export default function ClaimDetailView() {
  const router = useRouter();
  const { id, Id } = useParams() as { id: UUID; Id: UUID };
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

  const columns = useTableColumn();
  const table = useReactTable({
    manualPagination: true,
    data: [
      { uuid: '123', name: 'A1' },
      { uuid: '456', name: 'B1' },
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
    <div className="p-4">
      <HeaderWithBack
        title="Claim Details"
        subtitle="Here is the detailed view of the selected claim"
        path={`/projects/el-kenya/${id}/claim`}
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        {cardData?.map((item, index) => {
          return (
            <div key={index} className="p-4 rounded-md border bg-card">
              <h1 className="text-lg font-medium mb-2">{item.title}</h1>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground text-sm">{item.label1}</p>
                  <p className="text-primary text-base">{item.sublabel1}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{item.label2}</p>
                  <p className="text-primary text-base">{item.sublabel2}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput className="w-full" name="..." onSearch={() => {}} />
          <AddButton name="SMS" path="" />
        </div>
        <ElkenyaTable table={table} tableHeight="h-[calc(100vh-500px)]" />
      </div>
    </div>
  );
}
