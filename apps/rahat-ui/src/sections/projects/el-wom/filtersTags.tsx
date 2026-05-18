import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { mapStatus } from '@rahat-ui/query';

const SmsVoucherFiltersTags = ({
  filters,
  setFilters,
  total,
  labelMapping,
  setDateRange,
}: any) => {
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const getDisplayValue = (key: string, value: unknown) => {
    if (key === 'isImported') {
      if (value === true || value === 'true') return 'Imported';
      if (value === false || value === 'false') return 'Non-Imported';
      return 'All';
    }

    if (key === 'startDate' || key === 'endDate') {
      const dateValue = new Date(String(value));
      if (!Number.isNaN(dateValue.getTime())) {
        return format(dateValue, 'MMM dd yyyy');
      }
      return String(value ?? '');
    }

    if (typeof value === 'object' && value) {
      return format(value as Date, 'MMM dd yyyy');
    }
    const raw = String(value ?? '');
    if (key === 'phoneNumber' || key === 'noOfReferrals') {
      return raw;
    }
    const mapped = mapStatus(raw);
    return mapped === '-' ? raw : mapped;
  };

  const handleFilterArrayChange = (key: string, value: string) => {
    if (key === 'startDate' || key === 'endDate') {
      const { startDate: _startDate, endDate: _endDate, ...rest } = filters;
      setFilters(rest);
      setDateRange(undefined);
      return;
    }

    const { [key]: _, ...rest } = filters;
    setFilters(rest);
  };

  const handleClearFilter = () => {
    setFilters({});
    setDateRange(undefined);
  };

  return (
    <div className="rounded-md border bg-card py-2 px-4 text-sm mb-2">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        <p className="hidden sm:block text-primary min-w-max">
          {total} results found
        </p>
        <ScrollArea className="w-full py-2">
          <div className="flex gap-4 items-center">
            {filterArray.map((filter) => {
              if (filter.key === 'phone') return;
              const displayLabel =
                labelMapping[filter.key] ||
                filter.key.replace(/([A-Z])/g, ' $1').trim();
              return (
                <div className="flex items-center gap-2" key={filter.key}>
                  {displayLabel}
                  {/* {filter?.key.charAt(0).toUpperCase() + filter?.key.slice(1)}:{' '} */}
                  <span
                    onClick={() =>
                      handleFilterArrayChange(filter.key, filter.value)
                    }
                    className="cursor-pointer bg-primary py-1 px-2 text-white rounded text-xs flex items-center gap-2"
                  >
                    <>{getDisplayValue(filter.key, filter.value)}</>
                    <RxCrossCircled />
                  </span>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button
          className="text-white hidden sm:block"
          size={'sm'}
          onClick={handleClearFilter}
        >
          Clear filter
        </Button>
      </div>
    </div>
  );
};

export default SmsVoucherFiltersTags;
