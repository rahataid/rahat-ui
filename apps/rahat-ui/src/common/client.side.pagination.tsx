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

  const buttonClassName =
    'h-[clamp(28px,3vw,36px)] w-[clamp(28px,3vw,36px)] p-0 [&_svg]:size-[clamp(14px,1.4vw,18px)]';

  return (
    <div className="flex items-center justify-end gap-[clamp(8px,1.2vw,16px)] border-t px-[clamp(8px,1vw,16px)] pt-[clamp(4px,0.6vw,8px)] text-[clamp(11px,1vw,14px)]">
      <div className="flex items-center gap-[clamp(4px,0.6vw,8px)]">
        <div className="font-medium">Rows per page</div>
        <Select
          defaultValue={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[clamp(48px,5vw,64px)] h-[clamp(28px,3vw,36px)] px-[clamp(6px,0.8vw,12px)] py-0 text-[clamp(11px,1vw,14px)] [&>svg]:size-[clamp(12px,1.2vw,16px)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {['2', '10', '20', '30', '40', '50'].map((size) => (
                <SelectItem
                  key={size}
                  value={size}
                  className="text-[clamp(11px,1vw,14px)]"
                >
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
      <div className="flex gap-[clamp(4px,0.6vw,8px)]">
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
          onClick={() => table.setPageIndex(0)} // First page
          disabled={pageIndex === 0}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
          onClick={() => table.setPageIndex(pageCount - 1)} // Last page
          disabled={pageIndex >= pageCount - 1}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
