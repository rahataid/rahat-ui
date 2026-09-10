'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { ArrowLeft, Columns, ListFilter, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PaginatedResult } from '@rumsan/sdk/types';
import InlinePagination from '../../components/inlinePagination';

const READ_ONLY_FIELDS = new Set([
  'uuid',
  'createdAt',
  'updatedAt',
  'createdBy',
]);

const TOP_LEVEL_FIELDS = new Set([
  'uuid',
  'firstName',
  'lastName',
  'govtIDNumber',
  'gender',
  'birthDate',
  'phone',
  'email',
  'location',
  'latitude',
  'longitude',
  'koboId',
  'notes',
  'walletAddress',
  'bankedStatus',
  'internetStatus',
  'phoneStatus',
  'createdAt',
  'updatedAt',
  'createdBy',
]);

type BeneficiaryRow = Record<string, unknown>;
type DirtyMap = Map<string, Record<string, unknown>>;

type DragFill = {
  col: string;
  value: string;
  startRowIdx: number;
};

type Props = {
  groupName?: string;
  pageRows: BeneficiaryRow[];
  dirtyRows: DirtyMap;
  presentColumns: string[];
  addedColumns: Set<string>;
  availableColumns: string[];
  isLoading?: boolean;
  page: number;
  perPage: number;
  total: number;
  meta: PaginatedResult<unknown>['meta'];
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string | number) => void;
  onCellChange: (rowUuid: string, field: string, value: string) => void;
  onAddColumn: (colKey: string) => void;
  onRemoveColumn: (colKey: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export default function EditSubmitView({
  groupName,
  pageRows,
  dirtyRows,
  presentColumns,
  addedColumns,
  availableColumns,
  isLoading = false,
  page,
  perPage,
  total,
  meta,
  onPageChange,
  onPerPageChange,
  onCellChange,
  onAddColumn,
  onRemoveColumn,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const presentSet = new Set(presentColumns);
  const allColumns = [
    ...presentColumns,
    ...Array.from(addedColumns).filter((c) => !presentSet.has(c)),
  ];

  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Fill-drag state (Excel-style copy down)
  const [dragFill, setDragFill] = useState<DragFill | null>(null);
  const [dragFillEndIdx, setDragFillEndIdx] = useState<number | null>(null);
  const isDraggingFill = useRef(false);

  // Column filter state
  const [columnFilters, setColumnFilters] = useState<Map<string, Set<string>>>(new Map());
  const [filterPopoverCol, setFilterPopoverCol] = useState<string | null>(null);
  const [filterSearch, setFilterSearch] = useState('');

  const allColumnsKey = allColumns.join(',');

  useEffect(() => {
    setColumnOrder((prev) => {
      const prevSet = new Set(prev);
      const added = allColumns.filter((c) => !prevSet.has(c));
      const filtered = prev.filter((c) => allColumns.includes(c));
      return [...filtered, ...added];
    });
  }, [allColumnsKey]);

  useEffect(() => {
    setColumnFilters(new Map());
    setFilterSearch('');
  }, [page]);

  const orderedColumns = columnOrder.length ? columnOrder : allColumns;
  const visibleColumns = orderedColumns.filter(
    (col) => !hiddenColumns.has(col),
  );

  const handleDragStart = (col: string) => setDraggedCol(col);
  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    if (col !== draggedCol) setDragOverCol(col);
  };
  const handleDrop = (targetCol: string) => {
    if (!draggedCol || draggedCol === targetCol) return;
    setColumnOrder((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(draggedCol);
      const toIdx = next.indexOf(targetCol);
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, draggedCol);
      return next;
    });
    setDraggedCol(null);
    setDragOverCol(null);
  };
  const handleDragEnd = () => {
    setDraggedCol(null);
    setDragOverCol(null);
  };

  const toggleColumnVisibility = (col: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  const getRowUuid = (row: BeneficiaryRow): string => {
    const bene = row.beneficiary as Record<string, unknown> | undefined;
    return ((bene?.uuid ?? row.uuid) as string | undefined) ?? '';
  };

  const formatCellValue = (raw: unknown): string => {
    const s = String(raw ?? '');
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10);
    return s;
  };

  const getCellValue = (row: BeneficiaryRow, col: string): string => {
    const rowUuid = getRowUuid(row);
    const dirty = dirtyRows.get(rowUuid);
    if (dirty && Object.prototype.hasOwnProperty.call(dirty, col)) {
      return String(dirty[col] ?? '');
    }
    const bene = row.beneficiary as Record<string, unknown> | undefined;
    if (TOP_LEVEL_FIELDS.has(col)) {
      return formatCellValue(bene?.[col]);
    }
    const extras = bene?.extras as Record<string, unknown> | undefined;
    return formatCellValue(extras?.[col]);
  };

  const isDirtyCell = (row: BeneficiaryRow, col: string): boolean => {
    const rowUuid = getRowUuid(row);
    const dirty = dirtyRows.get(rowUuid);
    return !!dirty && Object.prototype.hasOwnProperty.call(dirty, col);
  };

  // ── Fill-drag handlers ────────────────────────────────────────────────────

  const onFillHandleMouseDown = (
    e: React.MouseEvent,
    col: string,
    rowIdx: number,
    value: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingFill.current = true;
    setDragFill({ col, value, startRowIdx: rowIdx });
    setDragFillEndIdx(rowIdx);
  };

  const onRowMouseEnter = (rowIdx: number) => {
    if (!isDraggingFill.current || !dragFill) return;
    setDragFillEndIdx(rowIdx);
  };

  const onMouseUp = () => {
    if (!isDraggingFill.current || !dragFill || dragFillEndIdx === null) {
      isDraggingFill.current = false;
      setDragFill(null);
      setDragFillEndIdx(null);
      return;
    }
    const start = Math.min(dragFill.startRowIdx, dragFillEndIdx);
    const end = Math.max(dragFill.startRowIdx, dragFillEndIdx);
    for (let i = start; i <= end; i++) {
      if (i === dragFill.startRowIdx) continue; // source cell already has value
      const row = filteredRows[i];
      if (!row) continue;
      const rowUuid = getRowUuid(row);
      onCellChange(rowUuid, dragFill.col, dragFill.value);
    }
    isDraggingFill.current = false;
    setDragFill(null);
    setDragFillEndIdx(null);
  };

  const isFillHighlighted = (rowIdx: number, col: string): boolean => {
    if (!dragFill || dragFillEndIdx === null) return false;
    if (dragFill.col !== col) return false;
    const start = Math.min(dragFill.startRowIdx, dragFillEndIdx);
    const end = Math.max(dragFill.startRowIdx, dragFillEndIdx);
    return rowIdx >= start && rowIdx <= end && rowIdx !== dragFill.startRowIdx;
  };

  const isColFiltered = (col: string): boolean => {
    const s = columnFilters.get(col);
    return !!s && s.size > 0;
  };

  const getUniqueColValues = (col: string): string[] => {
    const seen = new Set<string>();
    pageRows.forEach((row) => seen.add(getCellValue(row, col)));
    return Array.from(seen).sort();
  };

  const toggleFilterValue = (col: string, value: string) => {
    setColumnFilters((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(col) ?? []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      next.set(col, current);
      return next;
    });
  };

  const clearColumnFilter = (col: string) => {
    setColumnFilters((prev) => {
      const next = new Map(prev);
      next.delete(col);
      return next;
    });
  };

  const filteredRows = pageRows.filter((row) => {
    for (const [col, allowed] of columnFilters.entries()) {
      if (allowed.size === 0) continue;
      if (!allowed.has(getCellValue(row, col))) return false;
    }
    return true;
  });

  return (
    // onMouseUp on the outer div catches mouse-up anywhere in the table area
    <div className="flex flex-col w-full" onMouseUp={onMouseUp}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="gap-1 text-xs"
        >
          <ArrowLeft size={14} />
          Cancel
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={availableColumns.length === 0}
            >
              + Add column
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search field..."
                className="text-xs h-8"
              />
              <CommandList>
                <CommandEmpty>No field found.</CommandEmpty>
                <CommandGroup>
                  {availableColumns.map((col) => (
                    <CommandItem
                      key={col}
                      value={col}
                      className="text-xs"
                      onSelect={() => onAddColumn(col)}
                    >
                      {col}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Columns size={12} />
              Columns
              {hiddenColumns.size > 0 && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground px-1.5 py-0 text-[10px] leading-4">
                  {hiddenColumns.size}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search column..."
                className="text-xs h-8"
              />
              <CommandList>
                <CommandEmpty>No column found.</CommandEmpty>
                <CommandGroup>
                  {allColumns.map((col) => (
                    <CommandItem
                      key={col}
                      value={col}
                      className="text-xs flex items-center justify-between"
                      onSelect={() => toggleColumnVisibility(col)}
                    >
                      <span>{col}</span>
                      <span
                        className={
                          hiddenColumns.has(col)
                            ? 'text-muted-foreground'
                            : 'text-primary'
                        }
                      >
                        {hiddenColumns.has(col) ? 'hidden' : 'visible'}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-8 text-xs"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>

        {dirtyRows.size > 0 && (
          <span className="text-xs text-muted-foreground ml-1">
            {dirtyRows.size} row{dirtyRows.size !== 1 ? 's' : ''} edited
          </span>
        )}

        {groupName && (
          <span className="text-xs text-muted-foreground ml-2 truncate">
            {groupName}
          </span>
        )}
      </div>

      {/* Filter status bar */}
      {columnFilters.size > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground border-b flex items-center gap-2">
          Showing {filteredRows.length} of {pageRows.length} rows on this page
          <button
            onClick={() => setColumnFilters(new Map())}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Table */}
      <div className="import-container overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <table
            className="text-sm border-collapse select-none"
            style={{ minWidth: 'max-content' }}
          >
            <thead>
              <tr>
                {visibleColumns.map((col) => (
                  <th
                    key={col}
                    draggable
                    onDragStart={() => handleDragStart(col)}
                    onDragOver={(e) => handleDragOver(e, col)}
                    onDrop={() => handleDrop(col)}
                    onDragEnd={handleDragEnd}
                    className={`group/th border px-2 py-1 bg-secondary text-left text-xs whitespace-nowrap select-none cursor-grab active:cursor-grabbing transition-colors ${
                      dragOverCol === col
                        ? 'border-l-2 border-l-primary bg-primary/10'
                        : ''
                    } ${draggedCol === col ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {col}
                      {addedColumns.has(col) && (
                        <button
                          onClick={() => onRemoveColumn(col)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <X size={10} strokeWidth={2} />
                        </button>
                      )}
                      {!READ_ONLY_FIELDS.has(col) && (
                        <Popover
                          open={filterPopoverCol === col}
                          onOpenChange={(open) => {
                            setFilterPopoverCol(open ? col : null);
                            setFilterSearch('');
                          }}
                        >
                          <PopoverTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className={isColFiltered(col) ? 'text-primary' : 'text-muted-foreground opacity-0 group-hover/th:opacity-100'}
                              title={`Filter ${col}`}
                            >
                              <ListFilter size={10} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-2" align="start">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium truncate">{col}</span>
                              <button
                                onClick={() => clearColumnFilter(col)}
                                className="text-xs text-muted-foreground hover:text-destructive shrink-0"
                              >
                                Clear
                              </button>
                            </div>
                            <input
                              autoFocus
                              placeholder="Search..."
                              value={filterSearch}
                              onChange={(e) => setFilterSearch(e.target.value)}
                              className="w-full border rounded px-2 py-1 text-xs mb-2 outline-none"
                            />
                            <div className="max-h-48 overflow-y-auto space-y-1">
                              {getUniqueColValues(col)
                                .filter((v) =>
                                  v.toLowerCase().includes(filterSearch.toLowerCase()),
                                )
                                .map((value) => (
                                  <label
                                    key={value}
                                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted px-1 rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={columnFilters.get(col)?.has(value) ?? false}
                                      onChange={() => toggleFilterValue(col, value)}
                                    />
                                    <span className="truncate">{value || '(empty)'}</span>
                                  </label>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIdx) => {
                const rowUuid = getRowUuid(row);
                return (
                  <tr
                    key={rowUuid}
                    className="odd:bg-white even:bg-muted/30"
                    onMouseEnter={() => onRowMouseEnter(rowIdx)}
                  >
                    {visibleColumns.map((col) => {
                      const fillHighlight = isFillHighlighted(rowIdx, col);
                      if (READ_ONLY_FIELDS.has(col)) {
                        return (
                          <td
                            key={col}
                            className="border px-2 py-1 text-xs text-muted-foreground whitespace-nowrap"
                          >
                            {getCellValue(row, col)}
                          </td>
                        );
                      }
                      const cellValue = getCellValue(row, col);
                      return (
                        <td
                          key={col}
                          className={`border px-1 py-1 relative group ${
                            fillHighlight
                              ? 'bg-blue-100'
                              : isDirtyCell(row, col)
                              ? 'bg-yellow-50'
                              : ''
                          }`}
                        >
                          <input
                            className="bg-transparent outline-none text-sm px-1"
                            style={{ minWidth: 100 }}
                            value={cellValue}
                            onChange={(e) =>
                              onCellChange(rowUuid, col, e.target.value)
                            }
                          />
                          {/* Fill handle — small square at bottom-right, only visible on hover */}
                          <span
                            onMouseDown={(e) =>
                              onFillHandleMouseDown(e, col, rowIdx, cellValue)
                            }
                            className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary opacity-0 group-hover:opacity-100 cursor-crosshair hover:opacity-100"
                            title="Drag to fill down"
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <InlinePagination
        page={page}
        perPage={perPage}
        total={total}
        meta={meta}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </div>
  );
}
