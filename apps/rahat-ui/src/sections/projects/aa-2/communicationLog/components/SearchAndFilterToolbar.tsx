import React from 'react';
import { SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { Table } from '@tanstack/react-table';

interface SearchAndFilterToolbarProps {
  table: Table<any>;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  setPagination: (pagination: { page: number; perPage: number }) => void;
  pagination: { page: number; perPage: number };
}

export default function SearchAndFilterToolbar({
  table,
  filters,
  setFilters,
  setPagination,
  pagination,
}: SearchAndFilterToolbarProps) {
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue = value === 'ALL' ? '' : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <SearchInput
        name="Activity Title"
        className="w-[25%] min-w-[200px]"
        value={
          (table.getColumn('title')?.getFilterValue() as string) ??
          filters?.title
        }
        onSearch={(event) => handleFilterChange(event)}
      />
      <SearchInput
        name="Group Name"
        className="w-[25%] min-w-[200px]"
        value={
          (table.getColumn('groupName')?.getFilterValue() as string) ??
          filters?.groupName
        }
        onSearch={(event) => handleFilterChange(event)}
      />
      <SelectComponent
        name="Group Type"
        options={['Beneficiary', 'Stakeholder']}
        onChange={(value) =>
          handleFilterChange({
            target: { name: 'groupType', value },
          })
        }
        value={filters?.groupType || ''}
        className="w-[20%] min-w-[150px]"
      />
      <SelectComponent
        name="Status"
        options={[ 'Work in Progress','Completed', 'Failed']}
        onChange={(value) =>
          handleFilterChange({
            target: { name: 'status', value },
          })
        }
        value={filters?.status || ''}
        className="w-[20%] min-w-[150px]"
      />
    </div>
  );
}
