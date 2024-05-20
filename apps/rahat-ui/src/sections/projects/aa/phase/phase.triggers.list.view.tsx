import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
    Table as TableComponent,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';

export default function PhaseTriggersListView() {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => { return row.getValue('title') },
        },
        {
            accessorKey: 'optional',
            header: () => <div className='text-center'>Optional?</div>,
            cell: () => <div className='text-center'><Switch /></div>,
        },
    ];

    const table = useReactTable({
        data: [{ title: 'Testing Title' }],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <div className='bg-card rounded border'>
            <TableComponent>
                <ScrollArea className="h-[calc(100vh-242px)]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-96 text-center"
                                >
                                    No Triggers Selected
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </ScrollArea>
            </TableComponent>
        </div>
    )
}