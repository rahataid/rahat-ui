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
import {
  Upload,
  Search,
  X,
  TriangleAlert,
  Download,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

// Export configuration
const CUSTOMER_EXPORT_CONFIG = {
  columns: [
    { label: 'BDE', key: 'bde', width: 20 },
    { label: 'BDM', key: 'bdm', width: 20 },
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

  const activeFilterCount = React.useMemo(() => {
    if (!filters) return 0;
    const { startDate, endDate, ...rest } = filters as Record<string, any>;
    const otherCount = Object.values(rest).filter(
      (v) => v !== null && v !== undefined && v !== '',
    ).length;
    const dateRangeCount =
      (startDate !== null && startDate !== undefined && startDate !== '') ||
      (endDate !== null && endDate !== undefined && endDate !== '')
        ? 1
        : 0;
    return otherCount + dateRangeCount;
  }, [filters]);

  const statCards = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'text-foreground',
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Total number of customers across all categories',
    },
    {
      title: 'Active',
      value: activeCustomers,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/5',
      iconColor: 'text-success',
      tooltip: 'Customers with recent purchases within the active threshold',
    },
    {
      title: 'Inactive',
      value: inactiveCustomers,
      icon: UserX,
      color: 'text-warning',
      bgColor: 'bg-warning/5',
      iconColor: 'text-warning',
      tooltip: 'Customers who have not made purchases beyond the inactive threshold',
    },
    {
      title: 'Newly Inactive',
      value: newlyInactiveCustomers,
      icon: UserMinus,
      color: 'text-destructive',
      bgColor: 'bg-destructive/5',
      iconColor: 'text-destructive',
      tooltip:
        'Customers who recently transitioned from active to inactive status',
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Customers
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage customer relationships and data
              </p>
            </div>
            <div className="flex items-center gap-3">
              {failedBatch?.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/projects/el-crm/${projectUUID}/customers/upload/retry`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10 gap-2"
                      >
                        <span className="relative flex h-4 w-4">
                          <TriangleAlert className="h-4 w-4" />
                          <TriangleAlert className="h-4 w-4 absolute top-0 animate-ping opacity-50" />
                        </span>
                        {failedBatch.length} Failed{' '}
                        {failedBatch.length === 1 ? 'Batch' : 'Batches'}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {failedBatch.length} upload{' '}
                      {failedBatch.length === 1 ? 'batch has' : 'batches have'}{' '}
                      failed. Click to review and retry.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/el-crm/${projectUUID}/customers/upload`}
                  >
                    <Button size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import customers from a CSV or Excel file</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card
                key={stat.title}
                className="relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground leading-none">
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold tracking-tight ${stat.color}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`rounded-lg p-2.5 ${stat.bgColor}`}
                        >
                          <stat.icon
                            className={`h-5 w-5 ${stat.iconColor}`}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="max-w-[220px]">{stat.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customers Table Card */}
          <Card className="flex flex-col">
            {/* Filter Bar */}
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setFilters({});
                        setDateRange(undefined);
                      }}
                      className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear all
                    </Button>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadCustomers}
                        className="h-8 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download filtered customer data as Excel file</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                {/* Search BDE */}
                <div className="flex-1 min-w-[180px] max-w-[240px] space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    BDE
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search BDE..."
                      value={filters?.bde || ''}
                      onChange={(e) => handleSearch(e, 'bde')}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Search BDM */}
                <div className="flex-1 min-w-[180px] max-w-[240px] space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    BDM
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search BDM..."
                      value={filters?.bdm || ''}
                      onChange={(e) => handleSearch(e, 'bdm')}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Search Customer Name */}
                <div className="flex-1 min-w-[180px] max-w-[240px] space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Customer Name
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={filters?.name || ''}
                      onChange={(e) => handleSearch(e, 'name')}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Source Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Source
                  </Label>
                  <Select
                    value={filters?.source || 'all'}
                    onValueChange={(value) => handleFilter('source', value)}
                  >
                    <SelectTrigger className="w-[150px] h-9 text-sm">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value={CustomerSource.PRIMARY}>
                        Primary
                      </SelectItem>
                      <SelectItem value={CustomerSource.SECONDARY}>
                        Secondary
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Last Purchase Date
                  </Label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateChange}
                  />
                </div>

                {/* Category Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Category
                  </Label>
                  <Select
                    value={filters?.category || 'all'}
                    onValueChange={(value) => handleFilter('category', value)}
                  >
                    <SelectTrigger className="w-[160px] h-9 text-sm">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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
              </div>

              {/* Active Filter Tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Showing results for:
                  </span>
                  {filters?.bde && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      BDE: {filters.bde}
                      <button
                        type="button"
                        onClick={() => handleFilter('bde', 'all')}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters?.bdm && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      BDM: {filters.bdm}
                      <button
                        type="button"
                        onClick={() => handleFilter('bdm', 'all')}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters?.name && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Name: {filters.name}
                      <button
                        type="button"
                        onClick={() => handleFilter('name', 'all')}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters?.source && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Source: {filters.source}
                      <button
                        type="button"
                        onClick={() => handleFilter('source', 'all')}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters?.category && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Category: {filters.category?.split('_').join(' ')}
                      <button
                        type="button"
                        onClick={() => handleFilter('category', 'all')}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {dateRange?.from && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Date:{' '}
                      {format(dateRange.from, 'MMM d')}
                      {dateRange.to
                        ? ` – ${format(dateRange.to, 'MMM d, yyyy')}`
                        : ''}
                      <button
                        type="button"
                        onClick={() => {
                          setDateRange(undefined);
                          setFilters({
                            ...filters,
                            startDate: null,
                            endDate: null,
                          });
                        }}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Table */}
            <CardContent className="p-0">
              <DemoTable
                table={table}
                tableHeight="h-[calc(100vh-560px)]"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
