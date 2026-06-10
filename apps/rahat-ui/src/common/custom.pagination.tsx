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

  const buttonClassName =
    'h-[clamp(28px,3vw,36px)] w-[clamp(28px,3vw,36px)] p-0 [&_svg]:size-[clamp(14px,1.4vw,18px)]';

  return (
    <div className="flex items-center justify-end gap-[clamp(8px,1.2vw,16px)] p-[clamp(2px,0.4vw,4px)] px-[clamp(4px,0.6vw,8px)] bg-card text-[clamp(11px,1vw,14px)]">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {currentPage} of {total} row(s) selected.
      </div> */}
      {handlePageSizeChange && (
        <div className="flex items-center gap-[clamp(4px,0.6vw,8px)]">
          <div className="font-medium">Rows per page</div>
          <Select
            defaultValue={String(perPage)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[clamp(48px,5vw,64px)] h-[clamp(28px,3vw,36px)] px-[clamp(6px,0.8vw,12px)] py-0 text-[clamp(11px,1vw,14px)] [&>svg]:size-[clamp(12px,1.2vw,16px)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizes.map((size) => (
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
      )}
      <div>
        {meta?.total && meta.total > 0 ? (
          <>
            Page {currentPage} of {lastPage}
          </>
        ) : (
          <>Page {currentPage}</>
        )}
      </div>
      <div className="flex gap-[clamp(4px,0.6vw,8px)] items-center justify-center">
        {showChevrons && (
          <Button
            variant="outline"
            size="sm"
            className={buttonClassName}
            onClick={setBackwardPage}
            disabled={currentPage === 1}
          >
            <ChevronsLeft />
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
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
          className={buttonClassName}
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
            className={buttonClassName}
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
