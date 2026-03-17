import { CustomerCategory } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

// ─── All cell components live at MODULE scope ─────────────────────────────────
// This is non-negotiable. If defined inside the hook or inside useMemo,
// React creates a new component type every render → unmount/remount → focus loss.

function EditableCell({
  originalValue,
  hasError,
  rowIndex,
  field,
  onCellChange,
}: {
  originalValue: string;
  hasError: boolean;
  rowIndex: number;
  field: string;
  onCellChange: (rowIndex: number, field: string, value: string) => void;
}) {
  const [localValue, setLocalValue] = useState(originalValue || '');
  const isEdited = localValue !== (originalValue || '');

  if (!hasError) return <div>{originalValue || 'N/A'}</div>;

  return (
    <div className="flex flex-col gap-1">
      {isEdited && originalValue && (
        <div className="text-xs text-muted-foreground line-through opacity-50">
          {originalValue}
        </div>
      )}
      <Input
        value={localValue}
        className={`h-8 px-2 py-1 text-sm ${
          isEdited
            ? 'border-success ring-1 ring-success/30 bg-success/5'
            : 'border-destructive/50 bg-destructive/5 text-destructive'
        }`}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onCellChange(rowIndex, field, e.target.value);
        }}
        placeholder={`Fix ${field}...`}
      />
    </div>
  );
}

function DateEditableCell({
  originalValue,
  hasError,
  rowIndex,
  onCellChange,
}: {
  originalValue: string;
  hasError: boolean;
  rowIndex: number;
  onCellChange: (rowIndex: number, field: string, value: string) => void;
}) {
  const dateString = originalValue ? originalValue.split('T')[0] : '';
  const [localValue, setLocalValue] = useState(dateString);
  const isEdited = localValue !== dateString;

  if (!hasError) {
    return (
      <div>
        {originalValue ? new Date(originalValue).toLocaleDateString() : 'N/A'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {originalValue && (
        <div
          className={`text-xs ${
            isEdited
              ? 'line-through opacity-50 text-muted-foreground'
              : 'text-destructive'
          }`}
        >
          Original: {new Date(originalValue).toLocaleDateString()}
        </div>
      )}
      <Input
        type="date"
        value={localValue}
        className={`h-8 px-2 py-1 text-sm ${
          isEdited ? 'border-success bg-success/5' : 'border-destructive/50 bg-destructive/5'
        }`}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onCellChange(rowIndex, 'lastPurchaseDate', e.target.value);
        }}
      />
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFailedCustomersTableColumn = (
  onCellChange: (rowIndex: number, field: string, value: string) => void,
  resetKey: number,
) => {
  useParams() as { id: UUID }; // keep for future use if needed

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case CustomerCategory.ACTIVE:
        return 'blue';
      case CustomerCategory.INACTIVE:
        return 'gray';
      case CustomerCategory.NEWLY_INACTIVE:
        return 'red';
      default:
        return 'gray';
    }
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'customerCode',
        header: 'Customer Code',
        cell: ({ row }: any) => (
          <div>{row.getValue('customerCode') || 'N/A'}</div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Customer Name',
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('name')}
            hasError={row.original?.error?.name?.length > 0}
            rowIndex={row.index}
            field="name"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email ID',
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('email')}
            hasError={row.original?.error?.email?.length > 0}
            rowIndex={row.index}
            field="email"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone Number',
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('phone')}
            hasError={row.original?.error?.phone?.length > 0}
            rowIndex={row.index}
            field="phone"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'lastPurchaseDate',
        header: 'Last Purchase Date',
        cell: ({ row }: any) => (
          <DateEditableCell
            key={resetKey}
            originalValue={row.getValue('lastPurchaseDate')}
            hasError={row.original?.error?.lastPurchaseDate?.length > 0}
            rowIndex={row.index}
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const category = row.getValue('category') as string;
          const color = getCategoryBgColor(category);
          return category ? (
            <Badge className={`bg-${color}-200`}>
              {category?.split('_').join(' ')}
            </Badge>
          ) : (
            'N/A'
          );
        },
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => <div>{row.getValue('source') || 'N/A'}</div>,
      },
      {
        accessorKey: 'error',
        header: 'Error',
        cell: ({ row }: any) => {
          const errorObj = row.original?.error as
            | Record<string, string[]>
            | undefined;
          if (!errorObj || Object.keys(errorObj).length === 0) return 'N/A';
          return (
            <div className="flex flex-col space-y-1">
              {Object.entries(errorObj).map(([field, messages], idx) =>
                (messages as string[]).map((msg, msgIdx) => (
                  <div
                    key={`${idx}-${msgIdx}`}
                    className="text-sm text-destructive"
                  >
                    - {msg}
                  </div>
                )),
              )}
            </div>
          );
        },
      },
    ],
    [onCellChange, resetKey],
  );

  return columns;
};
