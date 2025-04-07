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
}: any) => {
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const handleFilterArrayChange = (key: string, value: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
  };

  return (
    <div className="rounded-md border bg-card py-2 px-4 text-sm mb-2">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        <p className="text-primary min-w-max">{total} results found</p>
        <ScrollArea className="w-full py-2">
          <div className="flex gap-4 items-center">
            {filterArray.map((filter) => {
              if (filter.key === 'phone') return;
              const displayLabel =
                labelMapping[filter.key] ||
                filter.key.replace(/([A-Z])/g, ' $1').trim();
              return (
                <div className="flex items-center gap-2">
                  {displayLabel}
                  {/* {filter?.key.charAt(0).toUpperCase() + filter?.key.slice(1)}:{' '} */}
                  <span
                    onClick={() =>
                      handleFilterArrayChange(filter.key, filter.value)
                    }
                    className="cursor-pointer bg-primary py-1 px-2 text-white rounded text-xs flex items-center gap-2"
                  >
                    {typeof filter.value === 'object' ? (
                      <>{format(filter.value, 'MMM dd yyyy')}</>
                    ) : (
                      <>{mapStatus(filter.value as string)}</>
                    )}
                    <RxCrossCircled />
                  </span>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button
          className="text-white"
          size={'sm'}
          onClick={() => setFilters({})}
        >
          Clear filter
        </Button>
      </div>
    </div>
  );
};

export default SmsVoucherFiltersTags;
