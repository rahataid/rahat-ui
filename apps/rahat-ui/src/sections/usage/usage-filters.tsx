'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useProjectList } from '@rahat-ui/query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { DatePicker } from '../../components/datePicker';

type UsageFiltersProps = {
  selectedXref: string | null;
  onXrefChange: (xref: string | null) => void;
  onDateChange: (dateRange: { from?: string; to?: string }) => void;
  onDateClear: () => void;
  defaultFrom?: Date;
  defaultTo?: Date;
};

export default function UsageFilters({
  selectedXref,
  onXrefChange,
  onDateChange,
  onDateClear,
  defaultFrom,
  defaultTo,
}: UsageFiltersProps) {
  const { data: projects } = useProjectList();
  const [fromDate, setFromDate] = useState<Date | undefined>(defaultFrom);
  const [toDate, setToDate] = useState<Date | undefined>(defaultTo);

  const handleFromChange = (date: Date | undefined) => {
    setFromDate(date);
    onDateChange({
      from: date ? format(date, 'yyyy-MM-dd') : undefined,
      to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleToChange = (date: Date | undefined) => {
    setToDate(date);
    onDateChange({
      from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      to: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleClear = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateClear();
  };

  const hasDateSelected = fromDate || toDate;

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

      <div className="flex items-center gap-2">
        <DatePicker
          placeholder="From"
          type="from"
          handleDateChange={(date: Date | undefined) => handleFromChange(date)}
          selectedDate={fromDate}
          maxDate={toDate}
          className="w-[160px]"
        />
        <span className="text-muted-foreground text-sm">to</span>
        <DatePicker
          placeholder="To"
          type="to"
          handleDateChange={(date: Date | undefined) => handleToChange(date)}
          selectedDate={toDate}
          minDate={fromDate}
          className="w-[160px]"
        />
        {hasDateSelected && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-8 w-8"
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
