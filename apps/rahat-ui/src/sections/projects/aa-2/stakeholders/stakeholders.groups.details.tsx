import React, { useState } from 'react';

import {
  AddButton,
  ClientSidePagination,
  DemoTable,
  SearchInput,
  HeaderWithBack,
  DataCard,
} from 'apps/rahat-ui/src/common';
import { User } from 'lucide-react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useProjectStakeholdersGroupTableColumns } from './columns';

type Props = {};

const StakeholdersGroupsDetails = (props: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectStakeholdersGroupTableColumns();
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
          subtitle="Detailed view of the selected stakeholders group"
          path="/stakeholders"
        />
      </div>
      <div className="flex gap-6 mb-3">
        <DataCard
          className="border-solid w-1/4  h-1/4 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Stakeholders"
          Icon={User}
          number={'10'}
        />
      </div>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-3 ">
          <SearchInput
            className="w-full"
            name="stakeholders name"
            onSearch={(e) => handleSearch(e.target.value)}
          />

          <SearchInput
            className="w-full"
            name="organization"
            onSearch={(e) => handleSearch(e.target.value)}
          />

          <SearchInput
            className="w-full"
            name="municipality"
            onSearch={(e) => handleSearch(e.target.value)}
          />

          <AddButton path="/projects/aa/stakeholders/add" name="Stakeholder" />
        </div>

        <DemoTable table={table} tableHeight="h-[calc(100vh-500px)]" />

        <ClientSidePagination table={table} />
      </div>
    </div>
  );
};

export default StakeholdersGroupsDetails;
