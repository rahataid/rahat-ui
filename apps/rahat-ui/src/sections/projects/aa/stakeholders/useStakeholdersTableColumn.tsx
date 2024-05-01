import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import StakeholdersEditPanel from './stakeholders.edit.view';

export default function useStakeholdersTableColumn() {
    const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

    const removeStakeholder = () => {
        alert('Deleted')
    }

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
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
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
                return (
                    <div className='flex gap-3 items-center'>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Pencil
                                        className="hover:text-primary cursor-pointer"
                                        size={20}
                                        strokeWidth={1.5}
                                        onClick={() => {
                                            setSecondPanelComponent(
                                                <StakeholdersEditPanel
                                                    stakeholdersDetail={row.original}
                                                    closeSecondPanel={closeSecondPanel}
                                                />,
                                            );
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-secondary ">
                                    <p className="text-xs font-medium">Edit</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <AlertDialog>
                                        <AlertDialogTrigger className="flex items-center">
                                            <Trash2
                                                className="cursor-pointer"
                                                color="red"
                                                size={20}
                                                strokeWidth={1.5}
                                            />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you absolutely sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently
                                                    delete this stakeholder.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => removeStakeholder()}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TooltipTrigger>
                                <TooltipContent className="bg-secondary ">
                                    <p className="text-xs font-medium">Delete</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            },
        },
    ];

    return columns;
}
