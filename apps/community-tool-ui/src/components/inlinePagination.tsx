'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { PaginatedResult } from '@rumsan/sdk/types';

const PAGE_SIZES = ['10', '20', '30', '40', '50', '100', '300', '500'];

type Props = {
  page: number;
  perPage: number;
  total: number;
  meta: PaginatedResult<unknown>['meta'];
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string | number) => void;
};

export default function InlinePagination({
  page,
  perPage,
  total,
  meta,
  onPageChange,
  onPerPageChange,
}: Props) {
  return (
    <div className="flex items-center gap-4 px-2 py-1 border-t bg-card text-sm flex-wrap">
      <span className="text-muted-foreground">Total: {total}</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Rows per page</span>
        <Select defaultValue={String(perPage)} onValueChange={onPerPageChange}>
          <SelectTrigger className="w-16 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <span className="text-muted-foreground">
        Page {page} of {meta?.lastPage ?? '—'}
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          type="button"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onPageChange(page + 1)}
          disabled={!meta?.lastPage || page >= meta.lastPage}
          type="button"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
