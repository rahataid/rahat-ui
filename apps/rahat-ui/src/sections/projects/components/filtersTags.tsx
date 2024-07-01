import React from 'react'
import { RxCrossCircled } from "react-icons/rx";

const FiltersTags = ({filters, setFilters, total}:any) => {

    const filterArray = Object.entries(filters).map(([key, value]) => {
        return { key, value };
      });

    const handleFilterArrayChange = (key: string, value: string) => {
        const { [key]: _, ...rest } = filters;
        setFilters(rest);
    }


  return (
    <div className="rounded-md border bg-card flex gap-8 py-2 px-4 text-sm mb-2 items-center">
          <span className='text-primary'>{total} results found</span>
          {
            filterArray.map(
            (filter) => <div className='flex items-center gap-2'>
            {filter.key}: <span  onClick={() => handleFilterArrayChange(filter.key, filter.value)} className='cursor-pointer bg-primary py-1 px-2 text-white rounded text-xs flex items-center gap-2'>{filter.value} <RxCrossCircled /></span> 
            </div>
            )
          }
          
        </div>
  )
}

export default FiltersTags