import React from 'react';
import { useTranslations } from 'next-intl';
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
  const tGlobal = useTranslations('GLOBAL');
  const t = useTranslations('AA Project');
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
        name={tGlobal('ACTIVITY_TITLE')}
        className="w-[25%] min-w-[200px]"
        value={
          (table.getColumn('title')?.getFilterValue() as string) ??
          filters?.title
        }
        onSearch={(event) => handleFilterChange(event)}
      />
      <SearchInput
        name={tGlobal('GROUP_NAME')}
        className="w-[25%] min-w-[200px]"
        value={
          (table.getColumn('groupName')?.getFilterValue() as string) ??
          filters?.groupName
        }
        onSearch={(event) => handleFilterChange(event)}
      />
      <SelectComponent
        name={t('GROUP_TYPE')}
        options={['Beneficiary', 'Stakeholder']}
        labels={{
          Beneficiary: tGlobal('BENEFICIARY'),
          Stakeholder: tGlobal('STAKEHOLDER'),
        }}
        onChange={(value) =>
          handleFilterChange({
            target: { name: 'groupType', value },
          })
        }
        value={filters?.groupType || ''}
        className="w-[20%] min-w-[150px]"
      />
      <SelectComponent
        name={t('STATUS')}
        options={['Work in Progress', 'Completed', 'Failed']}
        labels={{
          'Work in Progress': tGlobal('WORK_IN_PROGRESS'),
          Completed: tGlobal('COMPLETED'),
          Failed: tGlobal('FAILED'),
        }}
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
