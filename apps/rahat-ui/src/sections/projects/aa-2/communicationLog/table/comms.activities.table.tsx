'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useActivitiesHavingComms, usePagination } from '@rahat-ui/query';
import { UUID } from 'crypto';
import useCommsActivitiesTableColumns from './useCommsActivitesTableColumns';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';

export default function CommsActivitiesTable() {
  const { id: projectId } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const { activitiesData, activitiesMeta, isLoading } =
    useActivitiesHavingComms(projectId as UUID, { ...pagination, filters });

  const columns = useCommsActivitiesTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: activitiesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2">
        <SearchInput
          name="title"
          className="w-[100%]"
          value={
            (table.getColumn('title')?.getFilterValue() as string) ??
            filters?.title
          }
          onSearch={(event) => handleFilterChange(event)}
        />
        <SelectComponent
          name="Phase"
          options={['ALL', 'ACTIVATION', 'READINESS', 'PREPAREDNESS']}
          onChange={(value) =>
            handleFilterChange({
              target: { name: 'phase', value },
            })
          }
          value={filters?.phase || ''}
        />
        {/* <SelectComponent
            name="Status"
            options={[
              'ALL',
              'NOT_STARTED',
              'WORK_IN_PROGRESS',
              'COMPLETED',
              'DELAYED',
            ]}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'status', value },
              })
            }
            value={filters?.status || ''}
          /> */}
      </div>
      <div className=" bg-card border rounded p-4">
        <DemoTable
          table={table}
          tableHeight={'h-[calc(100vh-320px)]'}
          loading={isLoading}
          message="No Activities Found"
        />
        <CustomPagination
          meta={
            activitiesMeta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          setPagination={setPagination}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={activitiesMeta?.lastPage || 0}
        />
      </div>
    </div>
  );
}
