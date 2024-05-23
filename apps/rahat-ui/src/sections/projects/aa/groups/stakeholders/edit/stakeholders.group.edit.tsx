import * as React from 'react';
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import useMembersTableColumn from '../../useMembersTable';
import {
    useStakeholders,
    useStakeholdersStore,
    usePagination,
    useUpdateStakeholdersGroups,
    useSingleStakeholdersGroup,
} from '@rahat-ui/query';
import StakeholdersTable from '../../../stakeholders/stakeholders.table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';

export default function StakeholdersGroupEdit() {
    const { closeSecondPanel } = useSecondPanel();
    const params = useParams();
    const projectId = params.id as UUID;
    const groupId = params.groupId as UUID;
    const { data: stakeholdersGroupDetail } = useSingleStakeholdersGroup(projectId, groupId);
    const [showMembers, setShowMembers] = React.useState(false);

    const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
        usePagination();

    React.useEffect(() => {
        setPagination({ page: 1, perPage: 10 });
    }, []);

    useStakeholders(projectId, { ...pagination });

    const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
        stakeholders: state.stakeholders,
        stakeholdersMeta: state.stakeholdersMeta,
    }));

    const columns = useMembersTableColumn(stakeholdersGroupDetail);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        manualPagination: true,
        data: stakeholders ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const updateStakeholdersGroup = useUpdateStakeholdersGroups();

    const FormSchema = z.object({
        name: z.string().min(2, { message: 'Please enter group name.' }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: stakeholdersGroupDetail?.name,
        },
    });

    const handleUpdateStakeholdersGroups = async (
        data: z.infer<typeof FormSchema>,
    ) => {
        const prevMembers = stakeholdersGroupDetail?.stakeholders?.map(
            (member: any) => ({ uuid: member?.uuid }),
        );
        const stakeHolders = table
            .getSelectedRowModel()
            .rows?.map((stakeholder: any) => ({ uuid: stakeholder?.original?.uuid }));
        const finalMembers = table.getSelectedRowModel().rows?.length
            ? stakeHolders
            : prevMembers;
        try {
            await updateStakeholdersGroup.mutateAsync({
                projectUUID: projectId,
                stakeholdersGroupPayload: {
                    uuid: stakeholdersGroupDetail?.uuid,
                    ...data,
                    // stakeholders: [...stakeholdersGroupDetail?.stakeholders?.map((member: any) => ({ uuid: member?.uuid })), ...stakeHolders]
                    stakeholders: finalMembers,
                },
            });
        } catch (e) {
            console.error('Updating Stakeholders Group Error::', e);
        } finally {
            form.reset();
            // table.resetRowSelection();
        }
    };

    React.useEffect(() => {
        updateStakeholdersGroup.isSuccess && closeSecondPanel();
    }, [updateStakeholdersGroup]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateStakeholdersGroups)}>
                <div className="p-4 h-[calc(100vh-65px)] bg-card">
                    <h1 className="text-lg font-semibold mb-6">
                        Edit : Stakeholders Group
                    </h1>
                    <div className="shadow-md p-4 rounded-sm">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Group name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="flex justify-end">
                                <div className="flex gap-4">
                                    {table.getSelectedRowModel().rows.length ? (
                                        <Badge className="rounded h-10 px-4 py-2 w-max">
                                            {table.getSelectedRowModel().rows.length} - member
                                            selected
                                        </Badge>
                                    ) : null}
                                    <Button
                                        type="button"
                                        onClick={() => setShowMembers(!showMembers)}
                                    >
                                        {showMembers ? 'Hide Members' : 'Show Members'}
                                    </Button>
                                    <Button type="submit">Update Stakeholders Groups</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showMembers && (
                        <div className="mt-4 border rounded-sm shadow-md bg-card">
                            <StakeholdersTable table={table} tableScrollAreaHeight="h-[calc(100vh-345px)]" />
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
                    )}
                </div>
            </form>
        </Form>
    );
}
