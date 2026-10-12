import { FilterFn } from '@tanstack/react-table';

// Lowercase + strip all whitespace so "mi lan" matches "milan" and
// "00 00" matches "0000". Arrays (e.g. supportArea) are joined first.
export const normalizeSearchText = (value: unknown) => {
  const raw = Array.isArray(value) ? value.join(' ') : String(value ?? '');
  return raw.toLowerCase().replace(/\s+/g, '');
};

// TanStack per-column filter: blank/space-only shows all rows.
export const whitespaceInsensitiveFilter: FilterFn<any> = (
  row,
  columnId,
  filterValue,
) => {
  const search = normalizeSearchText(filterValue);
  if (!search) return true;
  return normalizeSearchText(row.getValue(columnId)).includes(search);
};
