'use client';

import React, { useState } from 'react';
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
import { Upload, Search } from 'lucide-react';
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
import { Customer, CustomerCategory, useCustomers } from '@rahat-ui/query';
import SpinnerLoader from '../../components/spinner.loader';

export default function CustomersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { id: projectUUID } = useParams() as { id: UUID };

  const { data: customers, isLoading } = useCustomers(projectUUID);

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
      {isLoading ? (
        <SpinnerLoader />
      ) : (
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Category</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="newly active">Newly Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer List</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {totalCustomers} of {totalCustomers} customers
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DemoTable table={table} tableHeight="h-[calc(100vh-595px)]" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
