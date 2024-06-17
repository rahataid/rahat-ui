import { ColumnDef } from '@tanstack/react-table';

export default function useDetailsBeneficiaryTableColumn() {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div>{row?.original?.Beneficiary?.pii?.name}</div>,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => <div>{row?.original?.Beneficiary?.pii?.phone || 'N/A'}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email Address',
            cell: ({ row }) => <div>{row?.original?.Beneficiary?.pii?.email || 'N/A'}</div>,
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => <div>{row?.original?.Beneficiary?.location || 'N/A'}</div>,
        }
    ];

    return columns;
}
