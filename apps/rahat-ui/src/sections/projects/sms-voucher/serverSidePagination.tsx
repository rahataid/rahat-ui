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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type IProps = {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageSizeChange?: (value: string | number) => void;
  handleFirstPage: () => void;
  handleLastPage: (page: number) => void;
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
  handleFirstPage,
  handleLastPage,
  meta,
  currentPage,
  perPage,
  total,
}: IProps) {
  const lastPage = meta?.lastPage || 1;
  return (
    <div className="flex items-center justify-end space-x-4 p-1 pl-2 pr-2 border-t bg-card">
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
        Page {currentPage} of {lastPage}
      </div>
      <div className="space-x-2 flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          type="button"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={meta?.lastPage == 0 || currentPage === meta?.lastPage}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleLastPage(meta?.lastPage)}
          disabled={meta?.lastPage == 0 || currentPage === meta?.lastPage}
          type="button"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
