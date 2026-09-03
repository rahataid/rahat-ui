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
import { ArrowLeft, Columns, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PaginatedResult } from '@rumsan/sdk/types';
import CustomPagination from '../../components/customPagination';

const READ_ONLY_FIELDS = new Set([
  'uuid',
  'createdAt',
  'updatedAt',
  'createdBy',
]);

// Fields that live on beneficiary top-level (not in extras)
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

type Props = {
  groupName?: string;
  pageRows: BeneficiaryRow[];
  dirtyRows: DirtyMap;
  allowedKeys: Set<string>;
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
  allowedKeys,
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
  // These fields exist on the beneficiary top-level but are never editable or
  // shown (system fields not exposed in field-definitions).
  const SYSTEM_ONLY = new Set(['id', 'archived', 'isVerified', 'extras']);

  // Build ordered column list from the first page row: uuid first, then every
  // key on beneficiary top-level + extras that appears in allowedKeys, then any
  // user-added columns not already present.
  const firstBene = pageRows[0]
    ? (pageRows[0].beneficiary as Record<string, unknown> | undefined) ?? {}
    : {};
  const extrasKeys = Object.keys(
    (firstBene.extras as Record<string, unknown> | undefined) ?? {},
  );
  const topLevelKeys = Object.keys(firstBene).filter(
    (k) =>
      !SYSTEM_ONLY.has(k) &&
      k !== 'uuid' &&
      (allowedKeys.size === 0 || allowedKeys.has(k)),
  );
  const extrasFiltered = extrasKeys.filter(
    (k) => allowedKeys.size === 0 || allowedKeys.has(k),
  );
  const presentSet = new Set(['uuid', ...topLevelKeys, ...extrasFiltered]);
  const allColumns = [
    'uuid',
    ...topLevelKeys,
    ...extrasFiltered,
    ...Array.from(addedColumns).filter((c) => !presentSet.has(c)),
  ];

  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const allColumnsKey = allColumns.join(',');

  useEffect(() => {
    setColumnOrder((prev) => {
      const prevSet = new Set(prev);
      const added = allColumns.filter((c) => !prevSet.has(c));
      const filtered = prev.filter((c) => allColumns.includes(c));
      return [...filtered, ...added];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allColumnsKey]);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState(0);

  // Unlock ancestor overflow:hidden so the table can scroll horizontally
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const patched: { node: HTMLElement; prev: string }[] = [];
    let node = el.parentElement;
    while (node && node !== document.body) {
      const computed = window.getComputedStyle(node).overflow;
      const inline = node.style.overflow;
      if (computed === 'hidden' || inline === 'hidden') {
        patched.push({ node, prev: inline });
        node.style.overflow = 'auto';
      }
      const computedX = window.getComputedStyle(node).overflowX;
      const inlineX = node.style.overflowX;
      if (computedX === 'hidden' || inlineX === 'hidden') {
        patched.push({ node, prev: inlineX });
        node.style.overflowX = 'auto';
      }
      node = node.parentElement;
    }
    return () => {
      patched.forEach(({ node, prev }) => {
        node.style.overflow = prev;
      });
    };
  }, []);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const update = () => setTableScrollWidth(el.scrollWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visibleColumns.length]);

  const onTopScroll = () => {
    if (tableScrollRef.current && topScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const onTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
  };

  const getRowUuid = (row: BeneficiaryRow): string => {
    const bene = row.beneficiary as Record<string, unknown> | undefined;
    return ((bene?.uuid ?? row.uuid) as string | undefined) ?? '';
  };

  const formatCellValue = (raw: unknown): string => {
    const s = String(raw ?? '');
    // Trim ISO datetime to date-only: "1988-11-03T00:00:00.000Z" → "1988-11-03"
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10);
    return s;
  };

  // Prefer dirty edit value; otherwise read from top-level or extras as appropriate.
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

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Top bar */}
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

      {/* Top scrollbar */}
      <div
        ref={topScrollRef}
        onScroll={onTopScroll}
        style={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          height: 12,
          width: '100%',
        }}
      >
        <div style={{ width: tableScrollWidth, height: 1 }} />
      </div>

      {/* Table scroll container */}
      <div
        ref={tableScrollRef}
        onScroll={onTableScroll}
        style={{ overflowX: 'scroll', width: '100%' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <table
            className="text-sm border-collapse"
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
                    className={`border px-2 py-1 bg-secondary text-left text-xs whitespace-nowrap select-none cursor-grab active:cursor-grabbing transition-colors ${
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
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => {
                const rowUuid = getRowUuid(row);
                return (
                  <tr key={rowUuid} className="odd:bg-white even:bg-muted/30">
                    {visibleColumns.map((col) =>
                      READ_ONLY_FIELDS.has(col) ? (
                        <td
                          key={col}
                          className="border px-2 py-1 text-xs text-muted-foreground whitespace-nowrap"
                        >
                          {getCellValue(row, col)}
                        </td>
                      ) : (
                        <td
                          key={col}
                          className={`border px-1 py-1 ${
                            isDirtyCell(row, col) ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <input
                            className="bg-transparent outline-none text-sm px-1"
                            style={{ minWidth: 100 }}
                            value={getCellValue(row, col)}
                            onChange={(e) =>
                              onCellChange(rowUuid, col, e.target.value)
                            }
                          />
                        </td>
                      ),
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <CustomPagination
        currentPage={page}
        handleNextPage={() => onPageChange(page + 1)}
        handlePrevPage={() => onPageChange(page - 1)}
        handlePageSizeChange={onPerPageChange}
        meta={meta}
        perPage={perPage}
        total={total}
      />
    </div>
  );
}
