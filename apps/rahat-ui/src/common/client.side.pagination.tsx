import React from 'react';
import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from 'libs/shadcn/src/components/ui/select';
import { Button } from 'libs/shadcn/src/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type IProps = {
  table: Table<any>;
};

export function ClientSidePagination({ table }: IProps) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="flex items-center justify-end space-x-8 border-t px-4 pt-2">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">Rows per page</div>
        <Select
          defaultValue={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {['2', '10', '20', '30', '40', '50'].map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        Page {pageIndex + 1} of {pageCount}
      </div>
      <div className="space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)} // First page
          disabled={pageIndex === 0}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)} // Last page
          disabled={pageIndex >= pageCount - 1}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
