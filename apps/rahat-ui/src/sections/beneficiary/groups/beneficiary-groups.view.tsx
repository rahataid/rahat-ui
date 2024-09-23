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

function BeneficiaryGroupsView() {
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
      <div className="p-4">
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
      />
    </>
  );
}

export default memo(BeneficiaryGroupsView);
