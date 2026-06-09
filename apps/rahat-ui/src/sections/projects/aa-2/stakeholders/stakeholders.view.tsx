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
  Heading,
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
import { ConflictDialog } from './component/conflict-dialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

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

  // Stakeholder conflict dialog state
  const [conflictGroupNames, setConflictGroupNames] = useState<string[]>([]);
  const [conflictStakeholderName, setConflictStakeholderName] =
    useState<string>('');
  const stakeholderConflictDialog = useBoolean();

  // Handle stakeholder deletion conflicts
  const handleStakeholderConflict = useCallback(
    (groupNames: string[], stakeholderName: string) => {
      setConflictGroupNames(groupNames);
      setConflictStakeholderName(stakeholderName);
      stakeholderConflictDialog.onTrue();
    },
    [stakeholderConflictDialog],
  );

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
  const columns = useProjectStakeholdersTableColumns(handleStakeholderConflict);

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
    <>
      <ConflictDialog
        open={stakeholderConflictDialog.value}
        onOpenChange={stakeholderConflictDialog.setValue}
        groupNames={conflictGroupNames}
        stakeholderName={conflictStakeholderName}
        conflictType="stakeholder"
      />
      <div className="px-4">
        <Heading
          title={
            activeTab === 'stakeholders'
              ? 'Stakeholders'
              : 'Stakeholders Groups'
          }
          description={
            activeTab === 'stakeholders'
              ? 'Track all the stakeholders in the project'
              : 'Track all stakeholder groups in the project'
          }
        />
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-row flex-wrap justify-between items-center gap-2 px-2 md:px-4 mb-2">
          <TabsList className="border bg-secondary rounded h-[clamp(28px,3vw,36px)]">
            <TabsTrigger
              id="stakeholders"
              className="data-[state=active]:bg-white text-[clamp(11px,1vw,14px)] h-[clamp(23px,3vw,28px)] "
              value="stakeholders"
            >
              Stakeholders
            </TabsTrigger>
            <TabsTrigger
              id="stakeholdersGroup"
              className="data-[state=active]:bg-white text-[clamp(11px,1vw,14px)] h-[clamp(23px,3vw,28px)] ]"
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
                router.replace(`/projects/aa/${projectId}/stakeholders/import`)
              }
              variant="outline"
              className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
            />
          </RoleAuth>
        </div>

        <TabsContent value="stakeholders">
          <div className="px-2 md:px-4">
            <div className="p-3 md:p-2 rounded-sm border">
              <div className="flex flex-wrap gap-2 mb-2">
                <SearchInput
                  className="flex-1 min-w-[120px]"
                  inputClassName="h-[clamp(28px,3vw,36px)]"
                  name="name"
                  onSearch={(e) => handleSearch(e, 'name')}
                  value={filters?.name || ''}
                />
                <SearchInput
                  className="hidden xl:block flex-1 min-w-[120px]"
                  inputClassName="h-[clamp(28px,3vw,36px)]"
                  name="municipality"
                  onSearch={(e) => handleSearch(e, 'municipality')}
                  value={filters?.municipality || ''}
                />
                <SearchInput
                  className="flex-1 min-w-[120px]"
                  inputClassName="h-[clamp(28px,3vw,36px)]"
                  name="organization"
                  onSearch={(e) => handleSearch(e, 'organization')}
                  value={filters?.organization || ''}
                />
                <SearchInput
                  className="flex-1 min-w-[120px]"
                  inputClassName="h-[clamp(28px,3vw,36px)]"
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
                    className='h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]'
                  />
                </RoleAuth>
              </div>
              <DemoTable
                table={table}
                message="No Stakeholders Available"
                tableHeight="h-[max(50vh,calc(90vh-230px))]"
              />

              <div className="[&_button]:h-[clamp(28px,3vw,34px)] [&_button_svg]:size-[clamp(14px,1.4vw,18px)] [&_[role=combobox]]:h-[clamp(28px,3vw,34px)] [&_div]:text-[clamp(11px,1vw,14px)]">
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
          </div>
        </TabsContent>

        <TabsContent value="stakeholdersGroup">
          <div className="px-2 md:px-4">
            <StakeGoldersGroups />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default memo(StakeholdersView);
