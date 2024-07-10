import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React, { useEffect, useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';

const FiltersTags = ({ filters, setFilters, total }: any) => {
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const handleFilterArrayChange = (key: string, value: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
  };

  return (
    <div className="rounded-md border bg-card flex py-2 px-4 text-sm mb-2 justify-between">
      <div className="flex items-center  gap-8">
        <span className="text-primary">{total} results found</span>
        {filterArray.map((filter) => (
          <div className="flex items-center gap-2">
            {filter.key}:{' '}
            <span
              onClick={() => handleFilterArrayChange(filter.key, filter.value)}
              className="cursor-pointer bg-primary py-1 px-2 text-white rounded text-xs flex items-center gap-2"
            >
              {typeof filter.value === 'object' ? (
                <>{format(filter.value, 'MMM dd yyyy')}</>
              ) : (
                <>{filter.value}</>
              )}
              <RxCrossCircled />
            </span>
          </div>
        ))}
      </div>
      <Button onClick={() => setFilters({})}>Clear filter</Button>
    </div>
  );
};

export default FiltersTags;
