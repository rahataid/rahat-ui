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
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import {
  CircleCheck,
  CircleX,
  Download,
  MessageSquareText,
  SlidersHorizontal,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { useTableColumns } from './use.table.columns';
import { VillageDoctorPageShell } from '../page-shell';

import { DateRange } from 'react-day-picker';
import * as XLSX from 'xlsx';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { UUID } from 'crypto';

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

  const { data, isFetching } = useCambodiaCommsList({
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
      title: 'Total Messages Sent',
      Icon: MessageSquareText,
      total: broadStatusCount?.data?.total || 0,
    },
    {
      title: 'Delivered Successfully',
      Icon: CircleCheck,
      total: broadStatusCount?.data?.success || 0,
    },
    {
      title: 'Delivery Failed',
      Icon: CircleX,
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
    <VillageDoctorPageShell
      title="Communication"
      subtitle="Broadcast status, delivery outcomes, and message history at a glance."
      contentClassName="space-y-6"
    >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cardData?.map((item, index) => (
            <DataCard
              key={index}
              title={item.title}
              Icon={item.Icon}
              number={String(item.total)}
              className="rounded-lg border border-border"
            />
          ))}
        </div>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              Filters & export
            </div>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="w-full xl:max-w-md">
                <DateRangePicker
                  placeholder="Pick a date range"
                  handleDateChange={handleDateChange}
                  type="range"
                  className="w-full"
                  handleClearDate={handleClearDate}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <SelectComponent
                  className="w-full sm:w-[200px]"
                  name="Status"
                  options={['ALL', 'SUCCESS', 'FAIL']}
                  onChange={(value) =>
                    handleFilterChange({
                      target: { name: 'status', value },
                    })
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={handleDownload}
                  disabled={
                    Object.keys(filters).length === 0 ||
                    filters.status === undefined
                  }
                >
                  <Download className="mr-2 h-4 w-4 shrink-0" /> Download Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CambodiaTable
              table={table}
              tableHeight="h-[calc(100vh-560px)]"
              loading={isFetching}
            />
            <CustomPagination
              currentPage={pagination.page}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              meta={(data?.response?.meta as any) || {
                total: 0,
                currentPage: 0,
              }}
              perPage={pagination?.perPage}
              total={data?.response?.meta?.total ?? 0}
            />
          </CardContent>
        </Card>
    </VillageDoctorPageShell>
  );
}
