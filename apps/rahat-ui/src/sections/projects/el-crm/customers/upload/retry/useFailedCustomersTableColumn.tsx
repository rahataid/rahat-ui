import { CustomerCategory } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
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

  if (!hasError)
    return (
      <span className="text-sm">
        {originalValue || <span className="text-muted-foreground/60">—</span>}
      </span>
    );

  return (
    <div className="flex flex-col gap-1">
      {isEdited && originalValue && (
        <div className="text-xs text-muted-foreground line-through opacity-50">
          {originalValue}
        </div>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        {!isEdited && (
          <TooltipContent side="bottom">
            <p className="text-xs">
              This field has a validation error — edit to fix
            </p>
          </TooltipContent>
        )}
      </Tooltip>
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
      <span className="text-sm tabular-nums">
        {originalValue ? (
          new Date(originalValue).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        ) : (
          <span className="text-muted-foreground/60">—</span>
        )}
      </span>
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
          isEdited
            ? 'border-success bg-success/5'
            : 'border-destructive/50 bg-destructive/5'
        }`}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onCellChange(rowIndex, 'lastPurchaseDate', e.target.value);
        }}
      />
    </div>
  );
}

function SourceEditableCell({
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
  const [localValue, setLocalValue] = useState(originalValue || '');
  const isEdited = localValue !== (originalValue || '');

  if (!hasError) {
    const val = originalValue;
    return val ? (
      <Badge variant={val === 'PRIMARY' ? 'default' : 'secondary'}>{val}</Badge>
    ) : (
      <span className="text-muted-foreground/60">—</span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {isEdited && originalValue && (
        <div className="text-xs text-muted-foreground line-through opacity-50">
          {originalValue}
        </div>
      )}
      <Select
        value={localValue}
        onValueChange={(val) => {
          setLocalValue(val);
          onCellChange(rowIndex, 'source', val);
        }}
      >
        <SelectTrigger
          className={`h-8 px-2 py-1 text-sm w-[130px] ${
            isEdited
              ? 'border-success ring-1 ring-success/30 bg-success/5'
              : 'border-destructive/50 bg-destructive/5 text-destructive'
          }`}
        >
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PRIMARY">PRIMARY</SelectItem>
          <SelectItem value="SECONDARY">SECONDARY</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useFailedCustomersTableColumn = (
  onCellChange: (rowIndex: number, field: string, value: string) => void,
  resetKey: number,
) => {
  useParams() as { id: UUID }; // keep for future use if needed

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case CustomerCategory.ACTIVE:
        return 'success' as const;
      case CustomerCategory.INACTIVE:
        return 'secondary' as const;
      case CustomerCategory.NEWLY_INACTIVE:
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  // Human-readable labels for error field names.
  const fieldLabels: Record<string, string> = {
    customerCode: 'Customer Code',
    name: 'Customer Name',
    phone: 'Phone',
    email: 'Email',
    channel: 'Channel',
    location: 'Region',
    source: 'Source',
    lastPurchaseDate: 'Last Purchase Date',
    bde: 'BDE',
    bdm: 'BDM',
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'bdm',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            BDM
          </span>
        ),
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('bdm')}
            hasError={row.original?.error?.bdm?.length > 0}
            rowIndex={row.index}
            field="bdm"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'bde',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            BDE
          </span>
        ),
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('bde')}
            hasError={row.original?.error?.bde?.length > 0}
            rowIndex={row.index}
            field="bde"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'customerCode',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Code
          </span>
        ),
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('customerCode')}
            hasError={row.original?.error?.customerCode?.length > 0}
            rowIndex={row.index}
            field="customerCode"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Customer Name
          </span>
        ),
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
        accessorKey: 'phone',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone
          </span>
        ),
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
        accessorKey: 'email',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </span>
        ),
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
        accessorKey: 'channel',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Channel
          </span>
        ),
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('channel')}
            hasError={row.original?.error?.channel?.length > 0}
            rowIndex={row.index}
            field="channel"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'location',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Region
          </span>
        ),
        cell: ({ row }: any) => (
          <EditableCell
            key={resetKey}
            originalValue={row.getValue('location')}
            hasError={row.original?.error?.location?.length > 0}
            rowIndex={row.index}
            field="location"
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'source',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Source
          </span>
        ),
        cell: ({ row }: any) => (
          <SourceEditableCell
            key={resetKey}
            originalValue={row.getValue('source')}
            hasError={row.original?.error?.source?.length > 0}
            rowIndex={row.index}
            onCellChange={onCellChange}
          />
        ),
      },
      {
        accessorKey: 'lastPurchaseDate',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Last Purchase
          </span>
        ),
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
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </span>
        ),
        cell: ({ row }) => {
          const category = row.getValue('category') as string;
          if (!category)
            return <span className="text-muted-foreground/60">—</span>;
          const variant = getCategoryVariant(category);
          return (
            <Badge variant={variant}>{category?.split('_').join(' ')}</Badge>
          );
        },
      },
      {
        accessorKey: 'error',
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Errors
          </span>
        ),
        cell: ({ row }: any) => {
          const errorObj = row.original?.error as
            | Record<string, string[]>
            | undefined;
          if (!errorObj || Object.keys(errorObj).length === 0)
            return <span className="text-muted-foreground/60">—</span>;
          const errorCount = Object.values(errorObj).flat().length;
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col gap-0.5 cursor-default">
                  {Object.entries(errorObj).map(([field, messages], idx) =>
                    (messages as string[]).map((msg, msgIdx) => (
                      <span
                        key={`${idx}-${msgIdx}`}
                        className="text-xs text-destructive leading-relaxed"
                      >
                        <span className="font-medium">
                          {fieldLabels[field] ?? field}:
                        </span>{' '}
                        {msg}
                      </span>
                    )),
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[300px]">
                <p className="text-xs">
                  {errorCount} validation error{errorCount !== 1 ? 's' : ''} —
                  fix the highlighted fields and retry
                </p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
    ],
    [onCellChange, resetKey],
  );

  return columns;
};
