import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type IProps = {
  table: Table<any>;
};

export default function ClientSidePagination({ table }: IProps) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const rangeStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const rangeEnd = Math.min((pageIndex + 1) * pageSize, totalRows);
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <TooltipProvider delayDuration={400}>
      <nav
        className="flex items-center justify-between border-t bg-card px-4 py-2.5 rounded-b-lg"
        aria-label="Pagination"
      >
        {/* Left: Result range summary */}
        <p className="hidden sm:block text-[13px] text-muted-foreground tabular-nums tracking-tight">
          <span className="font-medium text-foreground">
            {rangeStart.toLocaleString()}&ndash;{rangeEnd.toLocaleString()}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">
            {totalRows.toLocaleString()}
          </span>{' '}
          {totalRows === 1 ? 'result' : 'results'}
        </p>

        {/* Mobile: Compact summary */}
        <p className="sm:hidden text-[13px] text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground">
            {rangeStart}&ndash;{rangeEnd}
          </span>
          /{totalRows.toLocaleString()}
        </p>

        {/* Right: Controls cluster */}
        <div className="flex items-center gap-1.5">
          {/* Rows per page */}
          <div className="hidden sm:flex items-center gap-2">
            <label
              htmlFor="client-page-size"
              className="text-[13px] text-muted-foreground whitespace-nowrap"
            >
              Rows
            </label>
            <Select
              defaultValue="10"
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger
                id="client-page-size"
                className="h-8 text-[13px] rounded-md border-transparent bg-muted/50 hover:bg-muted focus:ring-1 focus:ring-ring transition-colors"
                aria-label="Rows per page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="min-w-[80px]">
                <SelectGroup>
                  <SelectItem value="5" className="text-[13px]">
                    5
                  </SelectItem>
                  <SelectItem value="10" className="text-[13px]">
                    10
                  </SelectItem>
                  <SelectItem value="20" className="text-[13px]">
                    20
                  </SelectItem>
                  <SelectItem value="30" className="text-[13px]">
                    30
                  </SelectItem>
                  <SelectItem value="40" className="text-[13px]">
                    40
                  </SelectItem>
                  <SelectItem value="50" className="text-[13px]">
                    50
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Separator
            orientation="vertical"
            className="hidden sm:block h-5 mx-1"
          />

          {/* Page indicator */}
          <span
            className="text-[13px] text-muted-foreground tabular-nums select-none px-1"
            aria-live="polite"
          >
            <span className="font-medium text-foreground" aria-current="page">
              {pageIndex + 1}
            </span>
            <span className="mx-0.5">/</span>
            {pageCount}
          </span>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Navigation */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!canPrev}
                  className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  type="button"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {!canPrev ? 'First page' : 'Previous page'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!canNext}
                  className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  type="button"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {!canNext ? 'Last page' : 'Next page'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
