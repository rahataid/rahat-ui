import { useTranslations } from 'next-intl';
import * as React from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import useMembersTableColumn from './useMembersTable';
import {
  useStakeholders,
  useStakeholdersStore,
  usePagination,
  useCreateStakeholdersGroups,
} from '@rahat-ui/query';
import CustomPagination from '../../../../components/customPagination';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { toast } from 'react-toastify';
import StakeholdersTableFilters from '../stakeholders/stakeholders.table.filters';
import StakeholdersTable from '../stakeholders/stakeholders.table';

export default function AddStakeholdersGroups() {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();
  const [showMembers, setShowMembers] = React.useState(false);
  const [selected, setSelected] = React.useState<number>();

  const groupsListPath = `/projects/aa/${projectId}/groups`;

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    setSelectedListItems,
    resetSelectedListItems,
    filters,
    selectedListItems,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  useStakeholders(projectId, { ...pagination, ...filters });

  const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
    stakeholders: state.stakeholders,
    stakeholdersMeta: state.stakeholdersMeta,
  }));

  const columns = useMembersTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: stakeholders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      rowSelection: selectedListItems,
    },
  });

  React.useEffect(() => {
    if (selectedListItems) {
      const length = Object.keys(selectedListItems)?.length;
      setSelected(length);
    }
  }, [selectedListItems]);

  const createStakeholdersGroup = useCreateStakeholdersGroups();

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('PLEASE_ENTER_GROUP_NAME') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCreateStakeholdersGroups = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const stakeholders = Object.keys(selectedListItems).filter(
      (key) => selectedListItems[key],
    );
    if (!stakeholders.length) {
      return toast.error(t('PLEASE_SELECT_MEMBERS'));
    }
    const stakeholdersList = stakeholders?.map((stakeholder) => ({
      uuid: stakeholder,
    }));
    try {
      await createStakeholdersGroup.mutateAsync({
        projectUUID: projectId,
        stakeholdersGroupPayload: {
          ...data,
          stakeholders: stakeholdersList,
        },
      });
      form.reset();
      resetSelectedListItems();
      router.push(groupsListPath);
    } catch (e) {
      console.error('Creating Stakeholders Group Error::', e);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateStakeholdersGroups)}>
        <div className="p-4 h-[calc(100vh-130px)] bg-card">
          <h1 className="text-lg font-semibold mb-6">
            {t('ADD_STAKEHOLDERS_GROUPS')}
          </h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{tg('GROUP_NAME')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('GROUP_NAME_PLACEHOLDER')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end">
                <div className="flex gap-4 items-end">
                  {selected ? (
                    <Badge className="rounded h-10 px-4 py-2 w-max">
                      {t('MEMBER_SELECTED', { selected })}
                    </Badge>
                  ) : null}
                  <Button
                    type="button"
                    onClick={() => setShowMembers(!showMembers)}
                  >
                    {showMembers ? t('HIDE_MEMBERS') : t('SHOW_MEMBERS')}
                  </Button>
                  <Button type="submit">{t('CREATE_STAKEHOLDERS_GROUPS')}</Button>
                </div>
              </div>
            </div>
          </div>
          {showMembers && (
            <div className="mt-4">
              <StakeholdersTableFilters
                projectID={projectId}
                filters={filters}
                setFilters={setFilters}
              />
              <div className="mt-2 border rounded-sm shadow-md bg-card">
                <StakeholdersTable
                  table={table}
                  tableScrollAreaHeight="h-[calc(100vh-418px)]"
                />
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
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
