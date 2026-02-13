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
import { Upload, Search, X } from 'lucide-react';
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
import {
  Customer,
  CustomerCategory,
  CustomerSource,
  useCustomers,
  usePagination,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export default function CustomersPage() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const debouncedFilters = useDebounce(filters, 500);

  const { customers, meta, isLoading } = useCustomers(projectUUID, {
    ...debouncedFilters,
    ...pagination,
  });

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

  const totalCustomers = customers?.length || 0;
  const activeCustomers =
    customers?.filter((c: Customer) => c.category === CustomerCategory.ACTIVE)
      .length || 0;
  const inactiveCustomers =
    customers?.filter((c: Customer) => c.category === CustomerCategory.INACTIVE)
      .length || 0;
  const newlyInactiveCustomers =
    customers?.filter(
      (c: Customer) => c.category === CustomerCategory.NEWLY_INACTIVE,
    ).length || 0;

  const columns = useCustomersTableColumn();

  const tableData = React.useMemo(() => {
    return customers?.map((c: Customer) => ({
      ...c,
      email: c?.extras?.email,
    }));
  }, [customers]);

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
          <Link href={`/projects/el-crm/${projectUUID}/customers/upload`}>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </Link>
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

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={filters?.name || ''}
                  onChange={(e) => handleSearch(e, 'name')}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
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

              {/* Source Filter */}
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

              {/* Clear Filter Btn */}
              {filters && Object.keys(filters).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({})}
                  className="gap-2 bg-transparent"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer List</CardTitle>
              {/* <div className="text-sm text-muted-foreground">
                Showing {totalCustomers} of {totalCustomers} customers
              </div> */}
            </div>
          </CardHeader>
          <CardContent>
            <DemoTable
              table={table}
              tableHeight="h-[calc(100vh-640px)]"
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
  );
}
