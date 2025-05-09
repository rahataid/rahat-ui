import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { IconLabelBtn } from './icon.label.btn';
import { Trash2, X } from 'lucide-react';

const FiltersTags = ({ filters, setFilters, total }: any) => {
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const handleFilterArrayChange = (key: string, value: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
  };

  return (
    <div className="rounded bg-card  px-4 text-sm mb-2">
      <div className="flex items-center gap-6 w-full">
        <p className="text-primary min-w-max">{total} results found</p>
        <ScrollArea className="w-full py-2">
          <div className="flex gap-4 items-center">
            {filterArray.map((filter, index) => (
              <div className="flex items-center gap-2" key={index}>
                {filter?.key.charAt(0).toUpperCase() + filter?.key.slice(1)}:{' '}
                <span
                  onClick={() =>
                    handleFilterArrayChange(filter.key, filter.value as string)
                  }
                  className="cursor-pointer bg-gray-200 py-2 px-2 text-slate-700 rounded-xl text-xs flex items-center gap-2"
                >
                  {filter.value}
                  <X className="w-4 h-4 text-red-600" />
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/* <Button onClick={() => setFilters({})}>Clear filter</Button> */}
        <IconLabelBtn
          Icon={Trash2}
          name="Clear"
          handleClick={() => setFilters({})}
          variant="outline"
          className="text-red-500 rounded-xl"
        />
      </div>
    </div>
  );
};

export default FiltersTags;
