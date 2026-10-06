'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { useGroupBeneficiaryDistinctValues } from '@rahat-ui/community-query';
import type { GroupBeneficiaryColumnFilter } from '@rahat-ui/community-query';
import { useDebounce } from '@rahat-ui/query';
import { ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';

const BLANK_LABEL = '(Blanks)';

export type ColumnFilterPopoverProps = {
  groupUuid: string;
  col: string;
  filters: GroupBeneficiaryColumnFilter[];
  active: boolean;
  onApply: (col: string, filter: GroupBeneficiaryColumnFilter | null) => void;
};

export default function ColumnFilterPopover({
  groupUuid,
  col,
  filters,
  active,
  onApply,
}: ColumnFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  // Ticked values; '' means (Blanks).
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const current = filters.find((f) => f.field === col);
  const currentCond = current?.conditions?.[0];

  // Each time the dropdown opens, start from the column's current filter.
  useEffect(() => {
    if (!open) return;
    setSearch('');
    setSelected(
      new Set(currentCond?.operator === 'in' ? currentCond.values ?? [] : []),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Only fetched while this dropdown is open.
  const { data, isFetching } = useGroupBeneficiaryDistinctValues(
    groupUuid,
    { field: col, search: debouncedSearch, filters },
    open,
  );
  const values = data?.values ?? [];
  const toKey = (v: string | null) => v ?? '';

  const allVisibleSelected =
    values.length > 0 && values.every((v) => selected.has(toKey(v.value)));

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      values.forEach((v) =>
        allVisibleSelected
          ? next.delete(toKey(v.value))
          : next.add(toKey(v.value)),
      );
      return next;
    });

  const apply = () => {
    onApply(
      col,
      selected.size > 0
        ? {
            field: col,
            conditions: [{ operator: 'in', values: Array.from(selected) }],
          }
        : null,
    );
    setOpen(false);
  };

  const applyContains = () => {
    const text = search.trim();
    if (!text) return;
    onApply(col, {
      field: col,
      conditions: [{ operator: 'contains', value: text }],
    });
    setOpen(false);
  };

  const clear = () => {
    onApply(col, null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          draggable={false}
          className={
            active
              ? 'text-primary'
              : 'text-muted-foreground opacity-0 group-hover/th:opacity-100'
          }
          title={`Filter ${col}`}
        >
          <ListFilter size={11} strokeWidth={2} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-60 p-2"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium truncate">{col}</span>
          <button
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-destructive shrink-0"
          >
            Clear
          </button>
        </div>

        {currentCond?.operator === 'contains' && (
          <div className="text-[11px] text-muted-foreground mb-1">
            Current: contains "{currentCond.value}"
          </div>
        )}

        <input
          autoFocus
          placeholder="Search values..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyContains();
          }}
          className="w-full border rounded px-2 py-1 text-xs mb-2 outline-none"
        />

        {search.trim() && (
          <button
            onClick={applyContains}
            className="w-full text-left text-xs text-primary hover:underline mb-2 px-1"
          >
            Show rows containing "{search.trim()}"
          </button>
        )}

        <div className="max-h-48 overflow-y-auto space-y-1">
          {isFetching && values.length === 0 ? (
            <div className="text-xs text-muted-foreground px-1 py-1">
              Loading values...
            </div>
          ) : values.length === 0 ? (
            <div className="text-xs text-muted-foreground px-1 py-1">
              No values found.
            </div>
          ) : (
            <>
              <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted px-1 rounded font-medium">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                />
                <span>(Select all{search.trim() ? ' shown' : ''})</span>
              </label>
              {values.map((v) => {
                const key = toKey(v.value);
                return (
                  <label
                    key={key || '__blank__'}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted px-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(key)}
                      onChange={() => toggle(key)}
                    />
                    <span className="truncate flex-1">
                      {v.value === null ? BLANK_LABEL : v.value}
                    </span>
                    <span className="text-muted-foreground">{v.count}</span>
                  </label>
                );
              })}
            </>
          )}
        </div>

        {data?.hasMore && (
          <div className="text-[11px] text-muted-foreground mt-1 px-1">
            Showing first {values.length} values — type to search more.
          </div>
        )}

        <div className="flex justify-between items-center mt-2 pt-2 border-t">
          <span className="text-[11px] text-muted-foreground">
            {selected.size > 0 ? `${selected.size} selected` : ''}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" className="h-7 text-xs" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
