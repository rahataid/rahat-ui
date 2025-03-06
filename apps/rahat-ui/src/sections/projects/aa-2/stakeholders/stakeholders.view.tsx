'use client';

import * as React from 'react';
import { memo, useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { useProjectStakeholdersTableColumns } from './columns';

import { CloudDownload } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  AddButton,
  ClientSidePagination,
  DemoTable,
  IconLabelBtn,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import {
  usePagination,
  useStakeholders,
  useStakeholdersStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import StakeGoldersGroups from './StakeholderGroups';
import Link from 'next/link';

function StakeholdersView() {
  const router = useRouter();
  const params = useParams();

  const searchParams = useSearchParams();

  const projectId = params.id as UUID;
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  useStakeholders(projectId, { ...pagination, ...filters });

  const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
    stakeholders: state.stakeholders,
    stakeholdersMeta: state.stakeholdersMeta,
  }));
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectStakeholdersTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: stakeholders ?? [],
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
          <h1 className="font-bold text-2xl text-label pl-4">Stakeholders</h1>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">
            Stakeholders Groups
          </h1>
        </div>
      </TabsContent>
      <p className="text-muted-foreground text-left pl-4 mb-0 pb-0">
        Track all the stakeholders in the project
      </p>

      <div className="flex justify-between items-center p-4">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="beneficiary"
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            Stakeholders
          </TabsTrigger>
          <TabsTrigger
            id="beneficiaryGroups"
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            Stakeholders Groups
          </TabsTrigger>
        </TabsList>

        {/* <Link
          href={`/projects/aa/${projectId}/stakeholders/import`}
          type="button"
          className="flex items-center justify-center gap-3 rounded-md w-48 border-2 border-primary text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <CloudDownload className="mr-1" /> <span>Import Stakeholders</span>
        </Link> */}

        <IconLabelBtn
          name="Import Stakeholders"
          Icon={CloudDownload}
          handleClick={() =>
            router.push(`/projects/aa/${projectId}/stakeholders/import`)
          }
          variant="outline"
        />
      </div>
      <TabsContent value="beneficiary">
        <div className="px-4">
          <div className="p-4 rounded-sm border">
            <div className="flex mb-2 gap-2">
              <SearchInput
                className="w-full"
                name="group"
                onSearch={(e) => handleSearch(e.target.value)}
              />
              <AddButton
                path={`/projects/aa/${projectId}/stakeholders/add`}
                name="Stakeholder"
              />
            </div>
            <DemoTable table={table} />

            <ClientSidePagination table={table} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div className="px-4">
          <StakeGoldersGroups />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(StakeholdersView);
