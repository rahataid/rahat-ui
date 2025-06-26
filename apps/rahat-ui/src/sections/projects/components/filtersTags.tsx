import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const DISPLAY_MAP: Record<string, Record<string, string>> = {
  voucherType: {
    SINGLE_VISION: 'Ready to Clip (R2C)',
  },
};

const FiltersTags = ({ filters, setFilters, total }: any) => {
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const handleFilterArrayChange = (key: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
  };

  return (
    <div className="rounded-md border bg-card py-2 px-4 text-sm mb-2">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <p className="text-primary min-w-max">{total} results found</p>
        <ScrollArea className="w-full py-2">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 items-center">
            {filterArray.map(({ key, value }) => {
              const prettyValue =
                typeof value === 'object'
                  ? format(value, 'MMM dd yyyy')
                  : DISPLAY_MAP[key]?.[value as string] ?? value;

              return (
                <div key={key} className="flex items-center gap-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                  <span
                    onClick={() => handleFilterArrayChange(key)}
                    className="cursor-pointer bg-primary py-1 px-2 text-white rounded text-xs flex items-center gap-2"
                  >
                    {prettyValue}
                    <RxCrossCircled />
                  </span>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button onClick={() => setFilters({})}>Clear filter</Button>
      </div>
    </div>
  );
};

export default FiltersTags;
