'use client';
import { memo, useEffect, useState } from 'react';

import { TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  useBeneficiaryGroupsList,
  useCreateBeneficiaryGroup,
  usePagination,
  useProjectList,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import BeneficiaryGroupsListView from './listView';
import { useBeneficiaryGroupsTableColumns } from './useBeneficiaryGroupsColumns';
import { Banknote, Plus, Users } from 'lucide-react';
import SearchInput from '../../projects/components/search.input';
import AddButton from '../../projects/components/add.btn';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';

function BeneficiaryGroupsView() {
  const router = useRouter();
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);

  const data = useBeneficiaryGroupsList({
    ...pagination,
    ...filters,
  });

  const groups = data?.data;

  const groupModal = useBoolean();

  // const createBeneficiaryGroup = useCreateBeneficiaryGroup();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useBeneficiaryGroupsTableColumns();

  // const bulkAssign = useBulkAssignBenToProject();
  const projectsList = useProjectList({
    page: 1,
    perPage: 10,
  });

  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleFilterProjectSelect = (project: string | UUID) => {
    setFilters({
      projectId: project,
    });
  };

  const benUUIDs = Object.keys(selectedListItems);

  const handleBulkAssign = async (selectedProject: string) => {
    // from the list of selected beneficiaries, filter out the ones that are already assigned to the project
    // TODO:Make this more cleaner
    // const benNotAssignedToTheProject = data?.data
    //   ?.filter(
    //     (ben: any) =>
    //       !ben.BeneficiaryProject.some(
    //         (project: any) => project.projectId === selectedProject,
    //       ),
    //   )
    //   .filter((ben: any) => benUUIDs.includes(ben.uuid))
    //   .map((ben: any) => ben.uuid);
    // if (!benNotAssignedToTheProject)
    //   return alert(
    //     'All selected beneficiaries are already assigned to the project',
    //   );
    // await bulkAssign.mutateAsync({
    //   projectUUID: selectedProject as UUID,
    //   beneficiaryUUIDs: benNotAssignedToTheProject as any[],
    // });
  };

  return (
    <>
      {/* <div className="p-4">
        <BeneficiaryGroupsListView
          table={table}
          handleBulkAssign={handleBulkAssign}
          isBulkAssigning={false}
          groupModal={groupModal}
          projects={projectsList?.data?.data || []}
          handleFilterProjectSelect={handleFilterProjectSelect}
          filters={filters}
        />
      </div>
      <CustomPagination
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={data?.response?.meta.lastPage || 0}
      /> */}
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput className="w-full" name="group" onSearch={() => { }} />
          <AddButton name="Group" path="/beneficiary/groups/add" />
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="grid grid-cols-4 gap-4">
            {groups &&
              groups?.map((i: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer rounded-md border shadow p-4"
                    onClick={() => {
                      router.push(`/beneficiary/groups/${i?.uuid}`);
                    }}
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="rounded-md bg-secondary grid place-items-center h-28">
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>
                      <Badge className="w-min">{i?.type ?? 'N/A'}</Badge>
                      <p className="text-base mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        28
                      </div>
                      <Button variant="secondary">
                        <Plus className="mr-1" size={18} strokeWidth={1.5} />
                        Assign Project
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

export default memo(BeneficiaryGroupsView);
