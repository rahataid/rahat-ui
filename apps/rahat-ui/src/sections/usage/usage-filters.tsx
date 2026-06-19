'use client';

import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useProjectList } from '@rahat-ui/query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { DateRangePicker } from '../../components/datePickerRange';

type UsageFiltersProps = {
  selectedXref: string | null;
  onXrefChange: (xref: string | null) => void;
  onDateChange: (dateRange: { from?: string; to?: string }) => void;
  onDateClear: () => void;
};

export default function UsageFilters({
  selectedXref,
  onXrefChange,
  onDateChange,
  onDateClear,
}: UsageFiltersProps) {
  const { data: projects } = useProjectList();

  const handleDateChange = (range: DateRange | undefined) => {
    if (!range) return;
    onDateChange({
      from: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      to: range.to ? format(range.to, 'yyyy-MM-dd') : undefined,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        value={selectedXref ?? 'all'}
        onValueChange={(val) => onXrefChange(val === 'all' ? null : val)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects?.data?.map((project: any) => (
            <SelectItem key={project.uuid} value={project.uuid}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateRangePicker
        placeholder="Select date range"
        type="usage"
        handleDateChange={handleDateChange}
        handleClearDate={onDateClear}
      />
    </div>
  );
}
