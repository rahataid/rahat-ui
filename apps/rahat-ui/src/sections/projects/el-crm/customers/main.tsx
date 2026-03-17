'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Upload, Search, X, TriangleAlert, Download } from 'lucide-react';
import DemoTable from 'apps/rahat-ui/src/components/table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCustomersTableColumn } from './useCustomersTableColumn';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  Customer,
  CustomerCategory,
  CustomerSource,
  useCustomers,
  usePagination,
  useCustomerStats,
  useFailedBatch,
  Stat,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { DateRangePicker } from './dateRangePicker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

// Export configuration
const CUSTOMER_EXPORT_CONFIG = {
  columns: [
    { label: 'BDE/BDM', key: 'bde', width: 20 },
    { label: 'Customer Code', key: 'customerCode', width: 20 },
    { label: 'Customer name', key: 'name', width: 25 },
    { label: 'Mobile No.', key: 'phone', width: 15 },
    { label: 'Email', key: 'email', width: 25 },
    { label: 'Channel', key: 'channel', width: 15 },
    { label: 'Region', key: 'location', width: 15 },
    { label: 'Source', key: 'source', width: 15 },
    { label: 'Last purchase', key: 'lastPurchaseDate', width: 15 },
    { label: 'Category', key: 'category', width: 15 },
  ],
};

const formatCustomerForExport = (customer: any) => {
  return CUSTOMER_EXPORT_CONFIG.columns.reduce(
    (acc, col) => ({
      ...acc,
      [col.label]:
        col.key === 'lastPurchaseDate'
          ? customer[col.key]
            ? format(new Date(customer[col.key]), 'yyyy-MM-dd')
            : ''
          : customer[col.key] ?? '',
    }),
    {} as Record<string, string>,
  );
};

export default function CustomersPage() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const debouncedFilters = useDebounce(filters, 1000);

  const { customers, meta, isLoading } = useCustomers(projectUUID, {
    ...debouncedFilters,
    ...pagination,
  });

  const { failedBatch } = useFailedBatch(projectUUID, {});

  const handleFilter = React.useCallback(
    (key: string, value: any) => {
      if (value === 'all') {
        setFilters({ ...filters, [key]: null });
        return;
      }
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range?.from && range?.to) {
      setFilters({
        ...filters,
        startDate: format(range.from, 'yyyy-MM-dd'),
        endDate: format(range.to, 'yyyy-MM-dd'),
      });
    }
  };

  const { data: stats } = useCustomerStats(projectUUID);

  const totalCustomers =
    stats?.find((stat: Stat) => stat.name === 'TOTAL_CUSTOMER')?.data || 0;
  const activeCustomers =
    stats?.find((stat: Stat) => stat.name === 'ACTIVE_CUSTOMER')?.data || 0;
  const inactiveCustomers =
    stats?.find((stat: Stat) => stat.name === 'INACTIVE_CUSTOMER')?.data || 0;
  const newlyInactiveCustomers =
    stats?.find((stat: Stat) => stat.name === 'NEWLY_INACTIVE_CUSTOMER')
      ?.data || 0;

  const columns = useCustomersTableColumn();

  const tableData = React.useMemo(() => {
    return customers?.map((c: Customer) => ({
      ...c,
      email: c?.extras?.email,
      channel: c?.extras?.channel,
      bde: c?.extras?.bde,
    }));
  }, [customers]);

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDownloadCustomers = React.useCallback(() => {
    if (!tableData?.length) {
      alert('No customers to download');
      return;
    }

    // Prepare and export data
    const data = tableData.map(formatCustomerForExport);
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Apply column widths
    worksheet['!cols'] = CUSTOMER_EXPORT_CONFIG.columns.map((col) => ({
      wch: col.width,
    }));

    // Create and write workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(
      workbook,
      `customers-${new Date().toISOString().split('T')[0]}.xlsx`,
    );
  }, [tableData]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">
              Manage customer relationships and data
            </p>
          </div>
          <div>
            {failedBatch?.length > 0 && (
              <Link
                href={`/projects/el-crm/${projectUUID}/customers/upload/retry`}
                className="mr-2"
              >
                <Button variant="outline" className="bg-orange-100">
                  <span className="relative">
                    <TriangleAlert className="text-orange-500" />
                    <TriangleAlert className="text-orange-500 absolute top-0 animate-ping" />
                  </span>
                  <span>{failedBatch?.length} Failed Batch</span>
                </Button>
              </Link>
            )}
            <Link href={`/projects/el-crm/${projectUUID}/customers/upload`}>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeCustomers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {inactiveCustomers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Newly Inactive Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {newlyInactiveCustomers}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardContent className="mt-6">
            <div className="flex flex-wrap items-center gap-4 mb-2 bg-muted p-3 rounded">
              {/* Search bde/bdm */}
              <div className="flex-1 min-w-[200px]">
                <Label>BDE/BDM</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bde/bdm..."
                    value={filters?.bde || ''}
                    onChange={(e) => handleSearch(e, 'bde')}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Search customers */}
              <div className="flex-1 min-w-[200px]">
                <Label>Customer Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={filters?.name || ''}
                    onChange={(e) => handleSearch(e, 'name')}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Source Filter */}
              <div>
                <Label>Source</Label>
                <Select
                  value={filters?.source || 'all'}
                  onValueChange={(value) => handleFilter('source', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Source</SelectItem>
                    <SelectItem value={CustomerSource.PRIMARY}>
                      Primary
                    </SelectItem>
                    <SelectItem value={CustomerSource.SECONDARY}>
                      Secondary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter purchase date */}
              <div>
                <Label>Last Purchase Date</Label>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateChange}
                />
              </div>

              {/* Category Filter */}
              <div>
                <Label>Category</Label>
                <Select
                  value={filters?.category || 'all'}
                  onValueChange={(value) => handleFilter('category', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Category</SelectItem>
                    <SelectItem value={CustomerCategory.ACTIVE}>
                      Active
                    </SelectItem>
                    <SelectItem value={CustomerCategory.INACTIVE}>
                      Inactive
                    </SelectItem>
                    <SelectItem value={CustomerCategory.NEWLY_INACTIVE}>
                      Newly Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filter Btn */}
              {filters && Object.keys(filters).length > 0 && (
                <Button
                  size="sm"
                  onClick={() => {
                    setFilters({});
                    setDateRange(undefined);
                  }}
                  className="gap-2 mt-6"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}

              {/* Download Btn */}
              <Button
                size="sm"
                onClick={handleDownloadCustomers}
                variant="outline"
                className="gap-2 mt-6"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
            <div>
              <DemoTable
                table={table}
                tableHeight="h-[calc(100vh-525px)]"
                loading={isLoading}
              />
              <CustomPagination
                meta={meta}
                handleNextPage={setNextPage}
                handlePrevPage={setPrevPage}
                handlePageSizeChange={setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={meta.total}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
