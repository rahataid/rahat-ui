'use client';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function VendorStatusFilter({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const t = useTranslations('VENDORS_LIST');
  const g = useTranslations('GLOBAL');

  return (
    <Select
      value=""
      onValueChange={(value) => onChange(value === 'All' ? '' : value)}
    >
      <SelectTrigger>
        <SelectValue placeholder={t('SELECT_STATUS')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="All">{g('ALL')}</SelectItem>
          <SelectItem value="Assigned">{g('ASSIGNED')}</SelectItem>
          <SelectItem value="Pending">{g('PENDING')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function VendorProjectFilter({
  projectNames,
  onChange,
}: {
  projectNames: string[];
  onChange: (value: string) => void;
}) {
  const g = useTranslations('GLOBAL');

  return (
    <Select
      value=""
      onValueChange={(value) => onChange(value === 'All' ? '' : value)}
    >
      <SelectTrigger>
        <SelectValue placeholder={g('SELECT_PROJECT')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="All">{g('ALL')}</SelectItem>
          {projectNames.map((projectName) => (
            <SelectItem key={projectName} value={projectName}>
              {projectName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export type VendorActiveFilter = {
  key: string;
  label: string;
  value: string;
  clear: () => void;
};

export function VendorFilterTags({
  filters,
  total,
  onClearAll,
}: {
  filters: VendorActiveFilter[];
  total: number;
  onClearAll: () => void;
}) {
  const t = useTranslations('VENDORS_LIST');
  const g = useTranslations('GLOBAL');

  if (filters.length === 0) return null;

  return (
    <div className="flex min-h-12 items-center gap-4 border-t py-2">
      <p className="min-w-max text-primary">{t('RESULTS_FOUND', { total })}</p>
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
        {filters.map((filter) => (
          <div
            key={filter.key}
            className="flex min-w-max items-center gap-2 text-sm"
          >
            <span>{filter.label}:</span>
            <button
              type="button"
              onClick={filter.clear}
              aria-label={`${g('CLEAR')} ${filter.label}`}
              className="flex items-center gap-2 rounded-xl bg-gray-200 px-3 py-2 text-xs text-slate-700"
            >
              {filter.value}
              <X className="h-4 w-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="min-w-max rounded-xl text-red-500"
        onClick={onClearAll}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {g('CLEAR')}
      </Button>
    </div>
  );
}
