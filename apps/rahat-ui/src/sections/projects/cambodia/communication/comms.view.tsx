import {
  useCambodiaBroadCastCounts,
  useCambodiaCommsList,
  usePagination,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { UUID } from 'crypto';
import { Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { useTableColumns } from './use.table.columns';

import { DateRange } from 'react-day-picker';
import * as XLSX from 'xlsx';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';

export default function CommunicationView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
  } = usePagination();

  const { data: broadStatusCount } = useCambodiaBroadCastCounts({
    projectUUID: id,
  }) as any;

  const { data, isLoading } = useCambodiaCommsList({
    projectUUID: id,
    page: pagination.page,
    perPage: pagination.perPage,
    ...filters,
  });
  const { data: filteredData } = useCambodiaCommsList({
    projectUUID: id,
    page: 1,
    perPage: data?.response?.meta?.total,
    ...filters,
  });

  const tableData = useMemo(() => {
    if (data?.data) {
      return data?.data;
    } else {
      return [];
    }
  }, [data?.data]);

  const columns = useTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.cuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const cardData = [
    {
      title: 'Total Message Sent',
      icon: 'MessageSquareText',
      total: broadStatusCount?.data?.total || 0,
    },
    {
      title: 'Message Delivery Successful',
      icon: 'CircleCheck',
      total: broadStatusCount?.data?.success || 0,
    },
    {
      title: 'Message Delivery Failed',
      icon: 'MessageSquareText',
      total: broadStatusCount?.data?.fail || 0,
    },
  ];

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue =
        value === 'ALL'
          ? setFilters({
              ...filters,
              status: {},
            })
          : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
  };

  const handleDateChange = (date: DateRange | undefined) => {
    if (date?.from) {
      const from = new Date(date.from);
      const to = new Date(date.to ?? date.from);

      const startOfDay = new Date(
        from.getFullYear(),
        from.getMonth(),
        from.getDate(),
        0,
        0,
        0,
        0,
      );

      const endOfDay = new Date(
        to.getFullYear(),
        to.getMonth(),
        to.getDate(),
        23,
        59,
        59,
        999,
      );

      setFilters({
        ...filters,
        startDate: startOfDay.toISOString(), // this will represent 00:00 local time in UTC
        endDate: endOfDay.toISOString(), // this will represent 23:59 local time in UTC
      });
    } else {
      setFilters({
        startDate: undefined,
        endDate: undefined,
      });
    }
  };

  const address = tableData
    ?.filter((item: any) => item.status === 'FAIL')
    .map((add) => add.address);

  const handleDownload = async () => {
    const rowsToDownload = filteredData?.data || [];
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((item: any) => ({
      Phone: item.address,
      Status: item.status,
      CreatedAt: new Date(item.createdAt).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Communication Report');

    XLSX.writeFile(workbook, 'Communication Report.xlsx');
  };

  const handleClearDate = () => {
    setFilters({
      ...filters,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Communication</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {cardData?.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={index} className="rounded-md border bg-card p-4 shadow">
                <div className="flex justify-between items-center">
                  <h1 className="text-base font-medium mb-1">{item.title}</h1>
                  <Icon />
                </div>
                <p className="text-primary font-semibold text-xl">
                  {item.total}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded border bg-card p-4">
          <div className="flex justify-end items-center space-x-2 mb-2">
            <DateRangePicker
              placeholder="Pick a date range"
              handleDateChange={handleDateChange}
              type="range"
              className="w-full"
              handleClearDate={handleClearDate}
            />

            <SelectComponent
              className="w-1/2"
              name="Status"
              options={['ALL', 'SUCCESS', 'FAIL']}
              onChange={(value) =>
                handleFilterChange({
                  target: { name: 'status', value },
                })
              }
              // value={table.getColumn('sendTo')?.getFilterValue() as string}
            />

            <Button
              variant="outline"
              className="text-muted-foreground w-1/4"
              onClick={handleDownload}
              disabled={
                Object.keys(filters).length === 0 ||
                filters.status === undefined
              }
            >
              <Download className="w-4 h-4 mr-3" /> Download Report
            </Button>
          </div>
          <CambodiaTable
            table={table}
            tableHeight="h-[calc(100vh-376px)]"
            loading={isLoading}
          />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(data?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={0}
      />
    </>
  );
}
