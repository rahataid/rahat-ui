import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
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
  return (
    <div className="flex items-center justify-between sm:justify-end space-x-4 p-1 pl-2 pr-2 border-t bg-card">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {currentPage} of {total} row(s) selected.
      </div> */}
      {handlePageSizeChange && (
        <div className="flex items-center gap-2">
          <div className="text-sm hidden sm:block font-medium">
            Rows per page
          </div>
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
        Page {currentPage} of {lastPage}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          // disabled={meta && meta?.prev === null && currentPage === 1}
          disabled={currentPage === 1}
          type="button"
        >
          Previous
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
          Next
        </Button>
      </div>
    </div>
  );
}
