export const REQUIRED_HEADERS = [
  'stakeholders name',
  'phone number',
  'designation',
  'organization',
  'district',
  'municipality',
] as const;

export const CELL_STYLES = {
  missing: 'bg-blue-100',
  duplicatePhone: 'bg-red-100 text-red-600',
  duplicateEmail: 'bg-yellow-100 text-yellow-600',
  error: 'bg-red-100 text-red-600',
  update: 'bg-yellow-100 text-yellow-700',
  new: 'bg-green-100 text-green-700',
} as const;

export type FileExtension = 'xlsx' | 'xls' | 'json' | 'csv';

export const ALLOWED_EXTENSIONS: Record<FileExtension, string> = {
  xlsx: 'excel',
  xls: 'excel',
  json: 'json',
  csv: 'csv',
};
