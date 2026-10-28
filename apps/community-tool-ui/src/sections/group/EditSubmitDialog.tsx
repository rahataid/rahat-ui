'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
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
import { X } from 'lucide-react';

const READ_ONLY_FIELDS = new Set(['uuid', 'createdAt', 'updatedAt', 'createdBy']);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editableRows: Record<string, any>[];
  addedColumns: Set<string>;
  availableColumns: string[];
  onCellChange: (rowIndex: number, field: string, value: string) => void;
  onAddColumn: (colKey: string) => void;
  onRemoveColumn: (colKey: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export default function EditSubmitDialog({
  open,
  onOpenChange,
  editableRows,
  addedColumns,
  availableColumns,
  onCellChange,
  onAddColumn,
  onRemoveColumn,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const allColumns =
    editableRows.length > 0 ? Object.keys(editableRows[0]) : [];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-5xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit & Submit Beneficiaries</AlertDialogTitle>
          <AlertDialogDescription>
            Edit the fields below and click Submit to update.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {availableColumns.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 text-xs">
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
          </div>
        )}

        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-sm border-collapse">
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
                <tr key={row.uuid}>
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
                          className="w-full bg-transparent outline-none text-sm px-1 min-w-[100px]"
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

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
