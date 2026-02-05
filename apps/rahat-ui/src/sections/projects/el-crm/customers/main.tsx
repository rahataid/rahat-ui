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

// Sample customer data
const customers = [
  {
    id: 1,
    name: 'John Smith',
    lastPurchaseDate: '2024-01-15',
    status: 'Active',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    category: 'Active',
    source: 'Primary',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    lastPurchaseDate: '2024-01-10',
    status: 'Inactive',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0124',
    category: 'Inactive',
    source: 'Secondary',
  },
  {
    id: 3,
    name: 'Michael Brown',
    lastPurchaseDate: '2024-01-20',
    status: 'Newly Active',
    email: 'michael.brown@email.com',
    phone: '+1-555-0125',
    category: 'Active',
    source: 'Primary',
  },
  {
    id: 4,
    name: 'Emily Davis',
    lastPurchaseDate: '2024-01-18',
    status: 'Active',
    email: 'emily.davis@email.com',
    phone: '+1-555-0126',
    category: 'Newly Inactive',
    source: 'Primary',
  },
  {
    id: 5,
    name: 'David Wilson',
    lastPurchaseDate: '2023-12-28',
    status: 'Inactive',
    email: 'david.wilson@email.com',
    phone: '+1-555-0127',
    category: 'Inactive',
    source: 'Secondary',
  },
];

export default function CustomersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { id: projectUUID } = useParams() as { id: UUID };

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus =
      statusFilter === 'all' ||
      customer.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => c.category === 'Active',
  ).length;
  const inactiveCustomers = customers.filter(
    (c) => c.category === 'Inactive',
  ).length;
  const newlyInactiveCustomers = customers.filter(
    (c) => c.category === 'Newly Inactive',
  ).length;

  const columns = useCustomersTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: filteredCustomers,
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
                Showing {filteredCustomers.length} of {customers.length}{' '}
                customers
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DemoTable table={table} tableHeight="h-[calc(100vh-595px)]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
