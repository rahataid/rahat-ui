import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye } from 'lucide-react';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import StakeholdersGroupsDetailView from './stakeholders.groups.detail.view';

export default function useStakeholdersGroupsTableColumn() {
    const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

    const columns: ColumnDef<any>[] = [
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
            accessorKey: 'name',
            header: 'Group Name',
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'stakeholders',
            header: 'Members',
            cell: ({ row }) =>
                <div>
                    {row.original?.stakeholders?.map((member: any, index: number) => (
                        <span key={member?.id}>
                            {member?.name}
                            {index !== row.original.stakeholders.length - 1 && ', '}
                        </span>
                    ))}
                </div>,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <Eye
                        className='hover:text-primary cursor-pointer'
                        size={20}
                        strokeWidth={1.5}
                        onClick={() => {
                            setSecondPanelComponent(
                                <StakeholdersGroupsDetailView
                                    stakeholdersGroupDetail={row.original}
                                    closeSecondPanel={closeSecondPanel}
                                />,
                            );
                        }}
                    />
                );
            },
        },
    ];

    return columns;
}
