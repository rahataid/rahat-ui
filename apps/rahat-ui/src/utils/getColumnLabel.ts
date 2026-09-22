/**
 * Label for a column in "toggle columns" menus.
 *
 * Column definitions already carry a translated `header` string, so reuse it
 * instead of falling back to `column.id` — the id is a raw accessor key
 * ("projectName") and would render untranslated whatever the active locale is.
 * Non-string headers (custom render functions) have no usable text, so those
 * still fall back to the id.
 */
export function getColumnLabel(column: {
  id: string;
  columnDef?: { header?: unknown };
}): string {
  const header = column.columnDef?.header;
  if (typeof header === 'string' && header.trim() !== '') return header;
  return column.id;
}
