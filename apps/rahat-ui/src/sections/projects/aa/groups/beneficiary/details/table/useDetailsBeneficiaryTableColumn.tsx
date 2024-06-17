import { ColumnDef } from '@tanstack/react-table';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';

export default function useDetailsBeneficiaryTableColumn() {
    const columns: ColumnDef<IStakeholdersItem>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email Address',
            cell: ({ row }) => <div>{row.getValue('email') || 'N/A'}</div>,
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
