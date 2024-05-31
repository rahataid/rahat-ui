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
  useBeneficiaryList,
  useBulkAssignBenToProject,
  useCreateBeneficiaryGroup,
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
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function BeneficiaryView() {
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

  useBeneficiaryGroupsList({ ...pagination });

  const { data } = useBeneficiaryList({
    ...pagination,

    ...filters,
  });
  const createBeneficiaryGroup = useCreateBeneficiaryGroup();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const projectModal = useBoolean();
  const groupModal = useBoolean();
  const bulkAssign = useBulkAssignBenToProject();
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
    const benNotAssignedToTheProject = data?.data
      ?.filter(
        (ben: any) =>
          !ben.BeneficiaryProject.some(
            (project: any) => project.projectId === selectedProject,
          ),
      )
      .filter((ben: any) => benUUIDs.includes(ben.uuid))
      .map((ben: any) => ben.uuid);

    if (!benNotAssignedToTheProject)
      return alert(
        'All selected beneficiaries are already assigned to the project',
      );

    await bulkAssign.mutateAsync({
      projectUUID: selectedProject as UUID,
      beneficiaryUUIDs: benNotAssignedToTheProject as any[],
    });

    setSelectedListItems([])
  };

  const handleCreateGroup = async (data: any) => {
    try {
      console.log(data);
      const payload = {
        name: data?.groupName,
        beneficiaries: data?.beneficiaries?.map((b: string) => ({
          uuid: b,
        })),
      };
      const result = await createBeneficiaryGroup.mutateAsync(payload);
      if (result) {
        toast.success('Beneficiary group added successfully!');
        router.push('/beneficiary');
        table.resetRowSelection(true);
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Failed to add beneficiary group!',
      );
    }
  };

  return (
    <>
      <TabsContent value="list">
        <BeneficiaryListView
          table={table}
          handleCreateGroup={handleCreateGroup}
          handleBulkAssign={handleBulkAssign}
          isBulkAssigning={false}
          projectModal={projectModal}
          groupModal={groupModal}
          projects={projectsList?.data?.data || []}
          handleFilterProjectSelect={handleFilterProjectSelect}
          filters={filters}
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
