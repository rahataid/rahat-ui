'use client';
import React, { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'libs/shadcn/src/components/ui/select';
import { PaginatedResult, Pagination } from '@rumsan/sdk/types';
import { Button } from 'libs/shadcn/src/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
type IProps = {
  handleNextPage: () => void;

  handlePrevPage: () => void;
  handleForwardPage?: () => void;
  handleBackwardPage?: () => void;
  handlePageSizeChange?: (value: string | number) => void;
  meta: PaginatedResult<any>['meta'];
  total?: number;
  perPage: number;
  currentPage: number;
  setPagination?: (pagination: any) => void;
  showChevrons?: boolean;
};

const pageSizes = ['5', '10', '20', '30', '40', '50', '100'];

export function CustomPagination({
  handleNextPage,
  handlePageSizeChange,
  handleBackwardPage,
  handleForwardPage,
  handlePrevPage,
  meta,
  currentPage,
  perPage,
  total,
  setPagination,
  showChevrons,
}: IProps) {
  const lastPage = meta?.lastPage || 1;
  if (showChevrons === undefined) {
    showChevrons = true;
  }
  const setForwardPage = useCallback(() => {
    setPagination?.((prev: Pagination) => ({
      ...prev,
      page: lastPage, // Directly move to the last page
    }));
  }, [lastPage]);

  const setBackwardPage = useCallback(() => {
    setPagination?.((prev: Pagination) => ({
      ...prev,
      page: 1, // Directly move to the first page
    }));
  }, []);

  return (
    <div className="flex items-center justify-end space-x-4 p-1 pl-2 pr-2  bg-card">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {currentPage} of {total} row(s) selected.
      </div> */}
      {handlePageSizeChange && (
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Rows per page</div>
          <Select
            defaultValue={String(perPage)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="text-sm">
        {meta?.total && meta.total > 0 ? (
          <>
            Page {currentPage} of {lastPage}
          </>
        ) : (
          <>Page {currentPage}</>
        )}
      </div>
      <div className="space-x-2 items-center justify-center">
        {showChevrons && (
          <Button
            variant="outline"
            size="sm"
            onClick={setBackwardPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft />
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          // disabled={meta && meta?.prev === null && currentPage === 1}
          disabled={currentPage === 1}
          type="button"
        >
          <ChevronLeft />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          type="button"
          // disabled={!table.getCanNextPage()}
          // disabled={
          //   meta && meta?.next === null && currentPage === meta?.lastPage
          // }
          disabled={meta?.lastPage == 0 || currentPage === meta?.lastPage}
        >
          <ChevronRight />
        </Button>
        {showChevrons && (
          <Button
            variant="outline"
            size="sm"
            onClick={setForwardPage}
            disabled={currentPage === meta?.lastPage}
          >
            <ChevronsRight />
          </Button>
        )}
      </div>
    </div>
  );
}
