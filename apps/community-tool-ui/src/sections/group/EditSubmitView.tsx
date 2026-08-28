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
import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const READ_ONLY_FIELDS = new Set(['uuid', 'createdAt', 'updatedAt', 'createdBy']);

type Props = {
  groupName?: string;
  editableRows: Record<string, any>[];
  addedColumns: Set<string>;
  availableColumns: string[];
  onCellChange: (rowIndex: number, field: string, value: string) => void;
  onAddColumn: (colKey: string) => void;
  onRemoveColumn: (colKey: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export default function EditSubmitView({
  groupName,
  editableRows,
  addedColumns,
  availableColumns,
  onCellChange,
  onAddColumn,
  onRemoveColumn,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const allColumns =
    editableRows.length > 0 ? Object.keys(editableRows[0]) : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState(0);

  // Walk up the DOM and unlock every ancestor with overflow:hidden so the
  // table can scroll horizontally inside the resizable panel + ScrollArea.
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
      // Also patch overflowX specifically
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

  // Keep the dummy scrollbar width in sync with the actual table scroll width
  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const update = () => setTableScrollWidth(el.scrollWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [allColumns.length]);

  // Sync top scrollbar → table
  const onTopScroll = () => {
    if (tableScrollRef.current && topScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  // Sync table → top scrollbar
  const onTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
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

        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-8 text-xs"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>

        {groupName && (
          <span className="text-xs text-muted-foreground ml-2 truncate">
            {groupName}
          </span>
        )}
      </div>

      {/* Top scrollbar — thin dummy div that mirrors table scroll width */}
      <div
        ref={topScrollRef}
        onScroll={onTopScroll}
        style={{ overflowX: 'scroll', overflowY: 'hidden', height: 12, width: '100%' }}
      >
        <div style={{ width: tableScrollWidth, height: 1 }} />
      </div>

      {/* Table scroll container */}
      <div
        ref={tableScrollRef}
        onScroll={onTableScroll}
        style={{ overflowX: 'scroll', width: '100%' }}
      >
        <table className="text-sm border-collapse" style={{ minWidth: 'max-content' }}>
          <thead>
            <tr>
              {allColumns.map((col) => (
                <th
                  key={col}
                  className="border px-2 py-1 bg-secondary text-left text-xs whitespace-nowrap"
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
            {editableRows.map((row, rowIndex) => (
              <tr key={row.uuid} className="odd:bg-white even:bg-muted/30">
                {allColumns.map((col) =>
                  READ_ONLY_FIELDS.has(col) ? (
                    <td
                      key={col}
                      className="border px-2 py-1 text-xs text-muted-foreground whitespace-nowrap"
                    >
                      {String(row[col] ?? '')}
                    </td>
                  ) : (
                    <td key={col} className="border px-1 py-1">
                      <input
                        className="bg-transparent outline-none text-sm px-1"
                        style={{ minWidth: 100 }}
                        value={row[col] ?? ''}
                        onChange={(e) =>
                          onCellChange(rowIndex, col, e.target.value)
                        }
                      />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
