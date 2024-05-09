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
  useBeneficiaryList,
  useBulkAssignBenToProject,
  usePagination,
  useProjectList,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import CustomPagination from '../../components/customPagination';
import { useBoolean } from '../../hooks/use-boolean';
import { useSecondPanel } from '../../providers/second-panel-provider';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import { useBeneficiaryTableColumns } from './useBeneficiaryColumns';

function BeneficiaryView() {
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

  

  const { data } = useBeneficiaryList({
    ...pagination,

    ...filters,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const projectModal = useBoolean();
  const bulkAssign = useBulkAssignBenToProject();
  const projectsList = useProjectList({});

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

  const handleBeneficiaryClick = (row: any) => {
    setSecondPanelComponent(
      <BeneficiaryDetail data={row} handleClose={closeSecondPanel} />,
    );
  };

  const benUUIDs = Object.keys(selectedListItems);

  const handleBulkAssign = async (selectedProject: string) => {
    // from the list of selected beneficiaries, filter out the ones that are already assigned to the project

    // TODO:Make this more cleaner
    const benNotAssignedToTheProject = data?.data
      ?.filter(
        (ben) =>
          !ben.BeneficiaryProject.some(
            (project) => project.projectId === selectedProject,
          ),
      )
      .filter((ben) => benUUIDs.includes(ben.uuid))
      .map((ben) => ben.uuid);

    if (!benNotAssignedToTheProject)
      return alert(
        'All selected beneficiaries are already assigned to the project',
      );

    await bulkAssign.mutateAsync({
      projectUUID: selectedProject as UUID,
      beneficiaryUUIDs: benNotAssignedToTheProject as any[],
    });
  };

  return (
    <>
      <TabsContent value="list">
        <BeneficiaryListView
          table={table}
          meta={data?.meta}
          handleClick={handleBeneficiaryClick}
          handleBulkAssign={handleBulkAssign}
          isBulkAssigning={false}
          projectModal={projectModal}
          projects={projectsList?.data?.data || []}
          loading={projectsList.isLoading}
          handleFilterProjectSelect={handleFilterProjectSelect}
          filters={filters}
        />
      </TabsContent>
      <TabsContent value="grid">
        <BeneficiaryGridView
          handleClick={handleBeneficiaryClick}
          data={data?.data}
        />
      </TabsContent>
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

export default memo(BeneficiaryView);
