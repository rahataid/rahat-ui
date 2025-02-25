import React, { useState } from 'react';
import HeaderWithBack from '../../common/header.with.back';
import {
  ClientSidePagination,
  DataCard,
  DemoTable,
  SearchInput,
} from '../../common';
import { Coins, User } from 'lucide-react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useProjectBeneficiaryGroupTableColumns } from './columns';

type Props = {};

const BeneficiaryGroupsDetails = (props: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectBeneficiaryGroupTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      // rowSelection: selectedListItems,
    },
  });

  const handleSearch = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Rumsan Beneficiary Group'}
          subtitle="Detailed view of the selected beneficiary group"
          path="/beneficiary"
        />
      </div>
      <div className="flex gap-6 mb-5">
        <DataCard
          className="border-solid w-1/4 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Beneficiaries"
          Icon={User}
          number={'10'}
        />
        <DataCard
          className="border-solid w-1/4 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Token Assigned"
          Icon={Coins}
          number={'10'}
        />
      </div>
      <div className="p-4 rounded-sm border">
        <SearchInput
          className="w-full"
          name="group"
          onSearch={(e) => handleSearch(e.target.value)}
        />
        <DemoTable table={table} tableHeight="h-[calc(100vh-500px)]" />

        <ClientSidePagination table={table} />
      </div>
    </div>
  );
};

export default BeneficiaryGroupsDetails;
