import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';

export default function useMembersTableColumn(members?: any) {
    const [prevData, setPrevData] = React.useState(members);
    const columns: ColumnDef<IStakeholdersItem>[] = [
        {
            id: 'select',
            header: ({ table }) => {
                return (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                )
            },
            cell: ({ row }) => {
                const isMember = prevData?.stakeholders?.some((s: any) => s.uuid === row.original.uuid);
                if (isMember && !row.getIsSelected()) {
                    row.toggleSelected(true);
                }
                return (
                    <Checkbox
                        checked={row.getIsSelected() || isMember}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                            if (prevData) {
                                setPrevData((prevData: any) => ({
                                    ...prevData,
                                    stakeholders: prevData.stakeholders.filter((s: any) => s.uuid !== row.original.uuid),
                                }));
                            }
                        }}

                        aria-label="Select row"
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => <div>{row.getValue('phone') || "N/A"}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email Address',
            cell: ({ row }) => <div>{row.getValue('email') || "N/A"}</div>,
        },
        {
            accessorKey: 'designation',
            header: 'Designation',
            cell: ({ row }) => <div>{row.getValue('designation')}</div>,
        },
        {
            accessorKey: 'organization',
            header: 'Organization',
            cell: ({ row }) => <div>{row.getValue('organization')}</div>,
        },
        {
            accessorKey: 'district',
            header: 'District',
            cell: ({ row }) => <div>{row.getValue('district')}</div>,
        },
        {
            accessorKey: 'municipality',
            header: 'Municipality',
            cell: ({ row }) => <div>{row.getValue('municipality')}</div>,
        },
    ];

    return columns;
}
