'use client';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginatedResult } from '@rumsan/sdk/types';

type IProps = {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageSizeChange?: (value: string | number) => void;
  meta: PaginatedResult<any>['meta'];
  total?: number;
  perPage: number;
  currentPage: number;
};

const pageSizes = ['5', '10', '20', '30', '40', '50', '100'];

export default function CustomPagination({
  handleNextPage,
  handlePageSizeChange,
  handlePrevPage,
  meta,
  currentPage,
  perPage,
  total,
}: IProps) {
  const lastPage = meta?.lastPage || 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = meta?.lastPage === 0 || currentPage === meta?.lastPage;
  const totalRecords = total ?? meta?.total ?? 0;
  const rangeStart = totalRecords === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const rangeEnd = Math.min(currentPage * perPage, totalRecords);

  return (
    <TooltipProvider delayDuration={400}>
      <nav
        className="flex items-center justify-between border-t bg-card px-4 py-2.5"
        aria-label="Pagination"
      >
        {/* Left: Result range summary */}
        <p className="hidden sm:block text-[13px] text-muted-foreground tabular-nums tracking-tight">
          <span className="font-medium text-foreground">
            {rangeStart.toLocaleString()}&ndash;{rangeEnd.toLocaleString()}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">
            {totalRecords.toLocaleString()}
          </span>{' '}
          {totalRecords === 1 ? 'result' : 'results'}
        </p>

        {/* Mobile: Compact summary */}
        <p className="sm:hidden text-[13px] text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground">
            {rangeStart}&ndash;{rangeEnd}
          </span>
          /{totalRecords.toLocaleString()}
        </p>

        {/* Right: Controls cluster */}
        <div className="flex items-center gap-1.5">
          {/* Rows per page */}
          {handlePageSizeChange && (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <label
                  htmlFor="page-size"
                  className="text-[13px] text-muted-foreground whitespace-nowrap"
                >
                  Rows
                </label>
                <Select
                  defaultValue={String(perPage)}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger
                    id="page-size"
                    className="h-8 text-[13px] rounded-md border-transparent bg-muted/50 hover:bg-muted focus:ring-1 focus:ring-ring transition-colors"
                    aria-label="Rows per page"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end" className="min-w-[80px]">
                    <SelectGroup>
                      {pageSizes.map((size) => (
                        <SelectItem key={size} value={size} className="text-[13px]">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Separator orientation="vertical" className="hidden sm:block h-5 mx-1" />
            </>
          )}

          {/* Page indicator */}
          <span
            className="text-[13px] text-muted-foreground tabular-nums select-none px-1"
            aria-live="polite"
          >
            <span className="font-medium text-foreground" aria-current="page">
              {currentPage}
            </span>
            <span className="mx-0.5">/</span>
            {lastPage}
          </span>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Navigation */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={isFirstPage}
                  className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  type="button"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {isFirstPage ? 'First page' : 'Previous page'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  type="button"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {isLastPage ? 'Last page' : 'Next page'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
