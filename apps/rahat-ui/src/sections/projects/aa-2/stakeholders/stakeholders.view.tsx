'use client';

import { memo, useCallback, useEffect, useState } from 'react';

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

import {
  usePagination,
  useStakeholders,
  useStakeholdersStore,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  AddButton,
  ClientSidePagination,
  CustomPagination,
  DemoTable,
  IconLabelBtn,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { CloudDownload } from 'lucide-react';
import StakeGoldersGroups from './StakeholderGroups';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { getPaginationFromLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';

function StakeholdersView() {
  const router = useRouter();
  const params = useParams();

  const searchParams = useSearchParams();
  const { activeTab, setActiveTab } = useActiveTab('stakeholders');
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
  const showStoredPagination = searchParams.get('storePagination') === 'true';
  useEffect(() => {
    const prevPagination = getPaginationFromLocalStorage(showStoredPagination);
    setPagination(prevPagination);
  }, [showStoredPagination]);

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

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="stakeholders">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">Stakeholders</h1>
        </div>
      </TabsContent>
      <TabsContent value="stakeholdersGroup">
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
            id="stakeholders"
            className="w-full data-[state=active]:bg-white"
            value="stakeholders"
          >
            Stakeholders
          </TabsTrigger>
          <TabsTrigger
            id="stakeholdersGroup"
            className="w-full data-[state=active]:bg-white"
            value="stakeholdersGroup"
          >
            Stakeholders Groups
          </TabsTrigger>
        </TabsList>

        <IconLabelBtn
          name="Import Stakeholders"
          Icon={CloudDownload}
          handleClick={() =>
            router.push(`/projects/aa/${projectId}/stakeholders/import`)
          }
          variant="outline"
        />
      </div>
      <TabsContent value="stakeholders">
        <div className="px-4">
          <div className="p-4 rounded-sm border">
            <div className="flex mb-2 gap-2">
              <SearchInput
                className="w-full"
                name="name"
                onSearch={(e) => handleSearch(e, 'name')}
                value={filters?.name || ''}
              />
              <AddButton
                path={`/projects/aa/${projectId}/stakeholders/add`}
                name="Stakeholder"
              />
            </div>
            <DemoTable table={table} />

            <CustomPagination
              meta={
                stakeholdersMeta || {
                  total: 0,
                  currentPage: 0,
                  lastPage: 0,
                  perPage: 0,
                  next: null,
                  prev: null,
                }
              }
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              setPagination={setPagination}
              total={stakeholdersMeta?.lastPage || 0}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="stakeholdersGroup">
        <div className="px-4">
          <StakeGoldersGroups />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(StakeholdersView);
