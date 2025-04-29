'use client';
import React, { useEffect, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useProjectSelectStakeholdersTableColumns } from './columns';
import { mockData } from 'apps/rahat-ui/src/common/data/data';
import {
  ClientSidePagination,
  CustomPagination,
  DemoTable,
  HeaderWithBack,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useCreateStakeholdersGroups,
  usePagination,
  useSingleStakeholdersGroup,
  useStakeholders,
  useStakeholdersStore,
  useUpdateStakeholdersGroups,
} from '@rahat-ui/query';
import StakeholdersTableFilters from './component/stakeholders.table.filters';

const UpdateOrAddStakeholdersGroup = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.editId as UUID;
  const router = useRouter();
  const isEditing = Boolean(groupId);
  const [stakeholdersGroupName, setStakeholdersGroupName] = useState('');
  const {
    filters,
    setFilters,
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
    setPagination,
  } = usePagination();

  useStakeholders(projectId, { ...pagination, ...filters });

  const { data: stakeholdersGroupDetail } = useSingleStakeholdersGroup(
    projectId,
    groupId,
  );
  const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
    stakeholders: state.stakeholders,
    stakeholdersMeta: state.stakeholdersMeta,
  }));

  useEffect(() => {
    if (isEditing && stakeholdersGroupDetail) {
      const preSelected = stakeholdersGroupDetail?.stakeholders?.reduce(
        (acc, stakeholder) => {
          acc[stakeholder.uuid] = true;
          return acc;
        },
        {},
      );
      setStakeholdersGroupName(stakeholdersGroupDetail.name);
      setSelectedListItems(preSelected);
    }
  }, [isEditing, setSelectedListItems, stakeholdersGroupDetail]);

  const createStakeholdersGroup = useCreateStakeholdersGroups();
  const updateStakeholdersGroup = useUpdateStakeholdersGroups();

  const handleSearch = (event, key) => {
    setFilters({ ...filters, [key]: event.target.value });
  };
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectSelectStakeholdersTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: stakeholders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleCreateGroup = async () => {
    const stakeholders = Object.keys(selectedListItems).filter(
      (key) => selectedListItems[key],
    );
    const stakeholdersList = stakeholders?.map((stakeholder) => ({
      uuid: stakeholder,
    }));
    const data = {
      projectUUID: projectId,
      stakeholdersGroupPayload: {
        name: stakeholdersGroupName,
        stakeholders: stakeholdersList,
      },
    };

    const updateData = {
      projectUUID: projectId,
      stakeholdersGroupPayload: {
        uuid: stakeholdersGroupDetail?.uuid,
        name: stakeholdersGroupName,
        stakeholders: stakeholdersList,
      },
    };
    if (isEditing) {
      await updateStakeholdersGroup.mutateAsync(updateData);
    } else {
      await createStakeholdersGroup.mutateAsync(data);
    }
    router.push(`/projects/aa/${projectId}/stakeholders/groups/${groupId}`);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <HeaderWithBack
          title={
            isEditing ? 'Add Stakeholder Group' : 'Create Stakeholder Group'
          }
          subtitle={`Fill the form below to ${
            isEditing ? 'update' : 'create a new'
          } stakeholder group`}
          path={`/projects/aa/${projectId}/stakeholders/groups/${groupId}`}
        />
        <div className="ml-1 mb-1">
          <Label className="mb-2"> Stake Holder Group Name</Label>
          <Input
            placeholder="Write stakeholder group name"
            className="w-full rounded-md"
            // value={stakeholdersGroupName || stakeholdersGroupDetail?.name}
            value={stakeholdersGroupName}
            onChange={(e) => setStakeholdersGroupName(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border p-4 ml-1">
        <div className="">
          <Heading
            title=" Select Stakeholders"
            description={`Select stakeholders from the list below to ${
              isEditing ? 'update' : 'create'
            } group`}
            titleStyle="2xl"
          />
        </div>

        {/* <div className="flex justify-between space-x-2 items-center mb-1 mt-1">
          <SearchInput
            className="w-full"
            name="stakeholders name"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) => {
              table.getColumn('name')?.setFilterValue(event.target.value);
              setFilters({ ...filters, name: event.target.value });
              setPagination({
                ...pagination,
                page: 1,
              });
            }}
          />

          <SearchInput
            className="w-full"
            name="organization"
            value={
              (table.getColumn('organization')?.getFilterValue() as string) ??
              ''
            }
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table
                .getColumn('organization')
                ?.setFilterValue(event.target.value)
            }
          />

          <SearchInput
            className="w-full"
            name="municipality"
            value={
              (table.getColumn('municipality')?.getFilterValue() as string) ??
              ''
            }
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table
                .getColumn('municipality')
                ?.setFilterValue(event.target.value)
            }
          />
        </div> */}
        <StakeholdersTableFilters
          projectID={projectId}
          filters={filters}
          setFilters={setFilters}
        />

        <DemoTable table={table} tableHeight="h-[calc(100vh-520px)]" />

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
          total={stakeholdersMeta?.lastPage || 0}
        />

        <div className="flex justify-end gap-4">
          <Button
            className="w-48 rounded-md"
            onClick={resetSelectedListItems}
            variant="outline"
          >
            Cancel{' '}
          </Button>
          <Button
            className="w-48 rounded-md"
            onClick={handleCreateGroup}
            disabled={!Object.keys(selectedListItems).length}
          >
            Add
            {Object.keys(selectedListItems).length
              ? `(${Object.keys(selectedListItems).length} stakeholders)`
              : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrAddStakeholdersGroup;
