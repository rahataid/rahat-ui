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
import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

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
  const debounceSearch = useDebounce(filters, 500);
  const showStoredPagination = searchParams.get('storePagination') === 'true';
  useEffect(() => {
    const prevPagination = getPaginationFromLocalStorage(showStoredPagination);
    setPagination(prevPagination);
  }, [showStoredPagination]);

  useStakeholders(projectId, { ...pagination, ...debounceSearch });

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
          <h1 className="font-bold text-2xl compact:text-lg text-label pl-4">
            Stakeholders
          </h1>
        </div>
      </TabsContent>
      <TabsContent value="stakeholdersGroup">
        <div>
          <h1 className="font-bold text-2xl compact:text-lg text-label pl-4">
            Stakeholders Groups
          </h1>
        </div>
      </TabsContent>

      <div className="flex justify-between items-center p-4 compact:p-2">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="stakeholders"
            className="w-full data-[state=active]:bg-white compact:text-xs compact:px-2 compact:py-1"
            value="stakeholders"
          >
            Stakeholders
          </TabsTrigger>
          <TabsTrigger
            id="stakeholdersGroup"
            className="w-full data-[state=active]:bg-white compact:text-xs compact:px-2 compact:py-1"
            value="stakeholdersGroup"
          >
            Stakeholders Groups
          </TabsTrigger>
        </TabsList>

        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
          hasContent={false}
        >
          <IconLabelBtn
            name="Import Stakeholders"
            Icon={CloudDownload}
            handleClick={() =>
              router.push(`/projects/aa/${projectId}/stakeholders/import`)
            }
            variant="outline"
          />
        </RoleAuth>
      </div>
      <TabsContent value="stakeholders">
        <div className="px-4 compact:px-2">
          <div className="p-4 compact:p-2 rounded-sm border">
            <div className="flex items-center mb-2 gap-2 compact:gap-1">
              <SearchInput
                className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
                name="name"
                onSearch={(e) => handleSearch(e, 'name')}
                value={filters?.name || ''}
              />
              <SearchInput
                className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
                name="municipality"
                onSearch={(e) => handleSearch(e, 'municipality')}
                value={filters?.municipality || ''}
              />
              <SearchInput
                className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
                name="organization"
                onSearch={(e) => handleSearch(e, 'organization')}
                value={filters?.organization || ''}
              />
              <SearchInput
                className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
                name="support area"
                onSearch={(e) => handleSearch(e, 'supportArea')}
                value={filters?.supportArea || ''}
              />
              <RoleAuth
                roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
                hasContent={false}
              >
                <AddButton
                  path={`/projects/aa/${projectId}/stakeholders/add`}
                  name="Stakeholder"
                  className="shrink-0 compact:h-7 compact:text-xs compact:px-2"
                />
              </RoleAuth>
            </div>
            {/* Compact table cells at <1000px */}
            <div className="compact:[&_th]:h-8 compact:[&_th]:px-2 compact:[&_th]:text-xs compact:[&_td]:px-2 compact:[&_td]:py-1 compact:[&_td]:text-xs">
              <DemoTable table={table} message="No Stakeholders Available" />
            </div>

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
        <div className="px-4 compact:px-2">
          <StakeGoldersGroups />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(StakeholdersView);
