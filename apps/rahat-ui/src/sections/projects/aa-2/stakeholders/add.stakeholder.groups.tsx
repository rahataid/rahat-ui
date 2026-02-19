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
import { stakeholderGroupSchema } from './schemas/stakeholder-group.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useCreateStakeholdersGroups,
  usePagination,
  useSingleStakeholdersGroup,
  useStakeholders,
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
  useStakeholdersStore,
  useUpdateStakeholdersGroups,
} from '@rahat-ui/query';
import StakeholdersTableFilters from './component/stakeholders.table.filters';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

const UpdateOrAddStakeholdersGroup = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.editId as UUID;
  const router = useRouter();
  const isEditing = Boolean(groupId);

  const form = useForm<z.infer<typeof stakeholderGroupSchema>>({
    resolver: zodResolver(stakeholderGroupSchema),
    defaultValues: {
      name: '',
      stakeholders: [],
    },
  });

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

  const debounceSearch = useDebounce(filters, 500);
  useStakeholders(projectId, { ...pagination, ...debounceSearch });

  useStakeholdersGroups(projectId, {
    sort: 'createdAt',
    order: 'desc',
  });

  const { stakeholdersGroups } = useStakeholdersGroupsStore((state) => ({
    stakeholdersGroups: state.stakeholdersGroups,
  }));

  const { data: stakeholdersGroupDetail } = useSingleStakeholdersGroup(
    projectId,
    groupId,
  );

  const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
    stakeholders: state.stakeholders,
    stakeholdersMeta: state.stakeholdersMeta,
  }));

  useEffect(() => {
    if (!isEditing || !stakeholdersGroupDetail) return;

    const preSelected =
      stakeholdersGroupDetail.stakeholders?.reduce(
        (acc: Record<string, boolean>, stakeholder) => {
          acc[stakeholder.uuid] = true;
          return acc;
        },
        {},
      ) ?? {};

    form.setValue('name', stakeholdersGroupDetail.name ?? '', {
      shouldValidate: true,
    });
    setSelectedListItems(preSelected);
  }, [isEditing, stakeholdersGroupDetail, form, setSelectedListItems]);

  const createStakeholdersGroup = useCreateStakeholdersGroups();
  const updateStakeholdersGroup = useUpdateStakeholdersGroups();

  const handleButtonClick = () => {
    const selectedIds = Object.keys(selectedListItems).filter(
      (key) => selectedListItems[key],
    );
    form.setValue('stakeholders', selectedIds);
    form.trigger('stakeholders');
  };

  const handleCreateGroup = async (
    data: z.infer<typeof stakeholderGroupSchema>,
  ) => {
    const existingGroups = stakeholdersGroups || [];
    const groupExists = existingGroups?.some((group: any) => {
      if (isEditing && group.uuid === groupId) {
        return false;
      }
      return group.name.toLowerCase() === data.name.trim().toLowerCase();
    });

    if (groupExists) {
      form.setError('name', {
        type: 'manual',
        message: 'A group with this name already exists',
      });
      return;
    }

    const stakeholdersList = data.stakeholders.map((uuid) => ({ uuid }));

    const payload = {
      projectUUID: projectId,
      stakeholdersGroupPayload: {
        name: data.name.trim(),
        stakeholders: stakeholdersList,
      },
    };

    const updatePayload = {
      projectUUID: projectId,
      stakeholdersGroupPayload: {
        uuid: stakeholdersGroupDetail?.uuid,
        name: data.name.trim(),
        stakeholders: stakeholdersList,
      },
    };

    try {
      if (isEditing) {
        await updateStakeholdersGroup.mutateAsync(updatePayload);
      } else {
        await createStakeholdersGroup.mutateAsync(payload);
      }
      router.push(
        `/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`,
      );
    } catch (error) {
      console.error('Error creating/updating group:', error);
    }
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useProjectSelectStakeholdersTableColumns();

  const handleSelectionChange = (updaterOrValue: any) => {
    setSelectedListItems(updaterOrValue);
    if (form.formState.isSubmitted) {
      const newSelection =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(selectedListItems)
          : updaterOrValue;
      const selectedIds = Object.keys(newSelection).filter(
        (key) => newSelection[key],
      );
      form.setValue('stakeholders', selectedIds, { shouldValidate: true });
    }
  };

  const table = useReactTable({
    manualPagination: true,
    data: stakeholders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleSelectionChange,
    getRowId: (row) => row.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  const { stakeholders: stakeholdersError } = form.formState.errors;

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateGroup)}>
          <div className="flex flex-col">
            <HeaderWithBack
              title={
                isEditing
                  ? 'Add Stakeholder to Group'
                  : 'Create Stakeholder Group'
              }
              subtitle={
                isEditing
                  ? 'Select stakeholders from the list below to add them to selected'
                  : 'Fill the form below to create a new'
              }
              path={`/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`}
            />
            <div className="ml-1 mb-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Stakeholder Group Name</Label>
                    <FormControl>
                      <Input
                        placeholder="Write stakeholder group name"
                        className="w-full rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-md border p-4 ml-1">
            <div className="">
              <Heading
                title="Select Stakeholders"
                description={`Select stakeholders from the list below to ${
                  isEditing ? 'update' : 'create'
                } group`}
                titleStyle="text-xl"
              />
            </div>

            <StakeholdersTableFilters
              projectID={projectId}
              filters={filters}
              setFilters={setFilters}
            />

            <DemoTable table={table} tableHeight="h-[calc(100vh-520px)]" />

            {stakeholdersError && (
              <p className="text-sm text-red-500 mt-2">
                {stakeholdersError.message}
              </p>
            )}

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

            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                className="w-48 rounded-md"
                onClick={() => {
                  form.reset();
                  resetSelectedListItems();
                }}
                variant="outline"
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="w-48 rounded-md"
                onClick={handleButtonClick}
              >
                {isEditing ? 'Update' : 'Add'}
                {Object.keys(selectedListItems).length > 0 &&
                  ` (${Object.keys(selectedListItems).length} stakeholders)`}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateOrAddStakeholdersGroup;
