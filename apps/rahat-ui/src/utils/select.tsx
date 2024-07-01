import React from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@rahat-ui/shadcn/src/components/ui/select';

  type SelectType = {
    filters: {
        [key: string]: string;
      },
    setFilters: any,
    options: any,
    placeholder: string,
    keys: string
  }

const SelectSection = ({filters, setFilters, options, placeholder, keys}: SelectType) => {
    console.log("The key is", keys)
    const handleDropdownChange = (value: string) => {
        setFilters(
          {...filters,
           [keys]: value
          }
          )
      }
  return (
    <Select onValueChange={(value) => handleDropdownChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${placeholder}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map(({value, label}: any) => <SelectItem value={value}>{label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
  )
}

export default SelectSection