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
  handlePageSizeChange: (value: string) => void;
  meta: PaginatedResult<any>['meta'];
};

const pageSizes = ['5', '10', '20', '30', '40', '50'];

export default function CustomPagination({
  handleNextPage,
  handlePageSizeChange,
  handlePrevPage,
  meta,
}: IProps) {
  return (
    <div className="flex items-center justify-end space-x-4 p-1 pl-2 pr-2 border-t">
      <div className="flex-1 text-sm text-muted-foreground">
        {meta.currentPage} of {meta.total} row(s) selected.
      </div>
      {handlePageSizeChange && (
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Rows per page</div>
          <Select defaultValue="5" onValueChange={handlePageSizeChange}>
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
      <div>
        Page {meta.currentPage} of {meta.total}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={meta.prev === null}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          // disabled={!table.getCanNextPage()}
          // disabled={meta.next === null}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
