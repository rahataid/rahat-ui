'use client';
import React, { useState } from 'react';
// import { Input } from '../../../../../libs/shadcn/src/components/ui/input';
// import { Label } from '../../../../../libs/shadcn/src/components/ui/label';
// import {
//   AddButton,
//   CustomPagination,
//   DemoTable,
//   Heading,
//   SearchInput,
// } from '../../../common';
// import HeaderWithBack from '../../../common/header.with.back';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useProjectSelectStakeholdersTableColumns } from './columns';
import { usePagination } from 'libs/query/src';
import { mockData } from 'apps/rahat-ui/src/common/data/data';
import {
  CustomPagination,
  DemoTable,
  HeaderWithBack,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
// import { Button } from '../../../../../libs/shadcn/src/components/ui/button';
// import { mockData } from '../../../common/data/data';
const AddStakeholdersGroup = () => {
  const [stakeholdersGroupName, setStakeholdersGroupName] = useState('');
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();

  const handleSearch = (value: string) => {
    console.log(value);
  };
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectSelectStakeholdersTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: mockData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleCreateGroup = async () => {
    const data = {
      stakeholdersGroupName: stakeholdersGroupName,
      stakeholders: Object.keys(selectedListItems).filter(
        (key) => selectedListItems[key],
      ),
    };
  };

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <HeaderWithBack
          title={'Create Stakeholder Group'}
          subtitle="Fill the form below to create a new stakeholder group"
          path="/stakeholders"
        />
        <div className="ml-1 mb-1">
          <Label className="mb-2"> Stake Holder Group Name</Label>
          <Input
            placeholder="Write stakeholder group name"
            className="w-full rounded-md"
            value={stakeholdersGroupName}
            onChange={(e) => setStakeholdersGroupName(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border p-4 ml-1">
        <div className="">
          <Heading
            title=" Select Stakeholders"
            description="Select stakeholders from the list below to create group"
            titleStyle="2xl"
          />
        </div>

        <div className="flex justify-between space-x-2 items-center mb-1 mt-1">
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
        </div>

        <DemoTable table={table} tableHeight="h-[calc(100vh-520px)]" />

        <CustomPagination
          meta={{ total: 0, currentPage: 0 }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
        />

        <div className="flex justify-end gap-4">
          <Button
            className="w-48 rounded-md"
            onClick={resetSelectedListItems}
            variant="outline"
          >
            Cancel{' '}
          </Button>
          <Button
            className="w-48 rounded-md"
            onClick={handleCreateGroup}
            disabled={!Object.keys(selectedListItems).length}
          >
            Add
            {Object.keys(selectedListItems).length
              ? `(${Object.keys(selectedListItems).length} stakeholders)`
              : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddStakeholdersGroup;
