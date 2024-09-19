'use client';
import { memo, useEffect, useState } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';

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
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CustomPagination from '../../components/customPagination';
import { useBoolean } from '../../hooks/use-boolean';
import { useSecondPanel } from '../../providers/second-panel-provider';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import { useBeneficiaryTableColumns } from './useBeneficiaryColumns';
import BeneficiaryGroupsView from './groups/beneficiary-groups.view';
import { CloudDownload, Download } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

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

  const handleDateChange = (date: Date, type: string) => {
    if (type === 'start') {
      setFilters({
        ...filters,
        startDate: date,
      });
    } else {
      setFilters({
        ...filters,
        endDate: date,
      });
    }
  };

  const handleFilterProjectSelect = (project: string | UUID) => {
    setFilters({
      ...filters,
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

    setSelectedListItems([]);
  };

  const handleCreateGroup = async (data: any) => {
    try {
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
    <Tabs defaultValue="beneficiary">
      <div className="flex justify-between items-center p-4">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            Beneficiary
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            Beneficiary Groups
          </TabsTrigger>
        </TabsList>
        <Button variant="outline">
          <CloudDownload className="mr-1" /> Import beneficiaries
        </Button>
      </div>
      <TabsContent value="beneficiary">
        <div className="p-4">
          <div className="mb-4">
            <h1 className="font-semibold text-2xl text-label">Beneficiary</h1>
          </div>
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
            setFilters={setFilters}
            handleDateChange={handleDateChange}
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
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <BeneficiaryGroupsView />
      </TabsContent>
    </Tabs>
  );
}

export default memo(BeneficiaryView);
