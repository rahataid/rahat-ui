import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { Eye } from 'lucide-react';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

export default function useStakeholdersTableColumn() {
    const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

    const columns: ColumnDef<IStakeholdersItem>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => <div>{row.getValue('phone')}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email Address',
            cell: ({ row }) => <div>{row.getValue('email')}</div>,
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
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                console.log(row)
                return (
                    <Eye
                        className="hover:text-primary cursor-pointer"
                        size={20}
                        strokeWidth={1.5}
                    // onClick={() => {
                    //     setSecondPanelComponent(
                    //         <ActivitiesDetailView
                    //             activityDetail={row.original}
                    //             closeSecondPanel={closeSecondPanel}
                    //         />,
                    //     );
                    // }}
                    />
                );
            },
        },
    ];

    return columns;
}
