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
  CustomPagination,
  DemoTable,
  Back,
  Heading,
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
        router.replace(
          `/projects/aa/${projectId}/stakeholders/groups/${groupId}`,
        );
      } else {
        await createStakeholdersGroup.mutateAsync(payload);
        router.push(
          `/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`,
        );
      }
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
    <div
      className="p-4 compact:p-2 flex flex-col"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateGroup)}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* Header */}
          <div className="shrink-0 mb-3 compact:mb-1">
            <div className="hidden compact:flex items-center gap-2 compact:[&>div]:mb-0">
              <Back
                path={
                  isEditing
                    ? `/projects/aa/${projectId}/stakeholders/groups/${groupId}`
                    : `/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`
                }
                className="border border-gray-300 text-gray-500 rounded px-2 py-0.5 mb-0 w-auto"
              />
              <h1 className="font-semibold compact:text-base compact:leading-tight">
                {isEditing
                  ? 'Update Stakeholder Group Details'
                  : 'Create Stakeholder Group'}
              </h1>
            </div>
            <div className="compact:hidden">
              <Back
                path={
                  isEditing
                    ? `/projects/aa/${projectId}/stakeholders/groups/${groupId}`
                    : `/projects/aa/${projectId}/stakeholders?tab=stakeholdersGroup`
                }
              />
              <h1 className="font-semibold text-[28px]">
                {isEditing
                  ? 'Update Stakeholder Group Details'
                  : 'Create Stakeholder Group'}
              </h1>
            </div>
          </div>

          {/* Group name input */}
          <div className="shrink-0 mb-2 compact:mb-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="compact:hidden">
                    <Label>Stakeholder Group Name</Label>
                    <FormControl>
                      <Input
                        placeholder="Write stakeholder group name"
                        className="w-full rounded-md"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <div className="hidden compact:flex items-center gap-2">
                    <Label className="text-xs shrink-0 whitespace-nowrap">
                      Group Name
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Write stakeholder group name"
                        className="h-7 text-xs rounded-md flex-1"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-md border p-4 compact:p-2 flex flex-col flex-1 min-h-0">
            <div className="shrink-0 mb-2 compact:mb-1">
              <Heading
                title="Select Stakeholders"
                description={`Select stakeholders from the list below to ${
                  isEditing ? 'update' : 'create'
                } group`}
                titleStyle="text-xl compact:text-sm"
              />
            </div>

            <div className="shrink-0 compact:[&_input]:h-7 compact:[&_input]:text-xs">
              <StakeholdersTableFilters
                projectID={projectId}
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            <div className="flex-1 min-h-0 compact:[&_th]:h-8 compact:[&_th]:px-2 compact:[&_th]:text-xs compact:[&_td]:px-2 compact:[&_td]:py-1 compact:[&_td]:text-xs">
              <DemoTable table={table} tableHeight="h-full" />
            </div>

            {stakeholdersError && (
              <p className="text-sm text-red-500 mt-2 shrink-0">
                {stakeholdersError.message}
              </p>
            )}

            <div className="shrink-0 compact:[&_button]:h-6 compact:[&_button]:w-6 compact:[&_button]:p-0 compact:[&_.text-sm]:text-xs compact:[&_[role='combobox']]:h-6 compact:[&_[role='combobox']]:text-xs compact:[&_[role='combobox']]:w-12">
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

            <div className="flex justify-end gap-4 mt-4 compact:mt-2 shrink-0">
              <Button
                type="button"
                className="w-48 compact:w-32 compact:text-xs compact:h-8 rounded-md"
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
                className="w-48 compact:w-auto compact:text-xs compact:h-8 rounded-md"
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
