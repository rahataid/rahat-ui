'use client';

import * as React from 'react';
import { memo, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../libs/shadcn/src/components/ui/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import CustomPagination from '../../common/customPagination';

import { useRouter } from 'next/navigation';

import { usePagination } from 'libs/query/src';
import SearchInput from '../../common/search.input';
import DemoTable from '../../common/table';
import BeneficiaryGroups from './BeneficiaryGroups';
import { useProjectBeneficiaryTableColumns } from './columns';
function BeneficiaryView() {
  const router = useRouter();
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectBeneficiaryTableColumns();

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
    console.log(e);
  };
  return (
    <Tabs defaultValue="beneficiary">
      <TabsContent value="beneficiary">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">Beneficiary</h1>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">
            Beneficiary Groups
          </h1>
        </div>
      </TabsContent>
      <p className="text-muted-foreground text-left pl-4 mb-0 pb-0">
        Track all the beneficiaries in the project
      </p>

      <div className="flex justify-between items-center p-4">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="beneficiary"
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            Beneficiary
          </TabsTrigger>
          <TabsTrigger
            id="beneficiaryGroups"
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            Beneficiary Groups
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="beneficiary">
        <div className="px-4">
          <div className="p-4 rounded-sm border">
            <SearchInput
              className="w-full"
              name="group"
              onSearch={(e) => handleSearch(e.target.value)}
            />
            <DemoTable table={table} />

            <CustomPagination
              meta={{ total: 0, currentPage: 0 }}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={0}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div className="px-4">
          <BeneficiaryGroups />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(BeneficiaryView);
