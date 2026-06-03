import { Table, flexRender } from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src/utils';

type IProps = {
  table: Table<any>;
  tableHeight?: string;
  loading?: boolean;
  emptyMessage?: string;
};

export default function CambodiaTable({
  table,
  tableHeight,
  loading,
  emptyMessage = 'No records found.',
}: IProps) {
  return (
    <div className="overflow-hidden rounded-b-none border-x border-b border-border/80 bg-card shadow-[inset_0_1px_0_0_hsl(var(--border)/0.5)]">
      <TableComponent>
        <ScrollArea className={tableHeight ?? 'h-[calc(100vh-340px)]'}>
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border/60 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                    >
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-48"
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2
                      className="h-8 w-8 animate-spin text-primary/70"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-sm font-medium">
                      Loading records…
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'border-border/50 transition-colors',
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/[0.15]',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="tabular-nums text-xs">
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
                  colSpan={table.getAllColumns().length}
                  className="h-32 text-center"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    {emptyMessage}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </TableComponent>
    </div>
  );
}
