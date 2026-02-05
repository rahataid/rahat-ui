'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Input } from '@rahat-ui/shadcn/components/input';
import DemoTable from 'apps/rahat-ui/src/components/table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useConsumersTableColumn } from './useConsumersTableColumn';
import { Search } from 'lucide-react';

const consumers = [
  {
    id: 1,
    name: 'Maria Garcia',
    lastRedemptionDate: '2024-01-15', // renamed from lastPurchaseDate
    phone: '+1-555-0201',
  },
  {
    id: 2,
    name: 'James Wilson',
    lastRedemptionDate: '2024-01-12', // renamed from lastPurchaseDate
    phone: '+1-555-0202',
  },
  {
    id: 3,
    name: 'Lisa Chen',
    lastRedemptionDate: '2024-01-18', // renamed from lastPurchaseDate
    phone: '+1-555-0203',
  },
  {
    id: 4,
    name: 'Robert Taylor',
    lastRedemptionDate: '2024-01-20', // renamed from lastPurchaseDate
    phone: '+1-555-0204',
  },
  {
    id: 5,
    name: 'Anna Rodriguez',
    lastRedemptionDate: '2024-01-14', // renamed from lastPurchaseDate
    phone: '+1-555-0205',
  },
  {
    id: 6,
    name: 'Kevin Lee',
    lastRedemptionDate: '2024-01-16', // renamed from lastPurchaseDate
    phone: '+1-555-0206',
  },
];

export default function ConsumersView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConsumers = consumers.filter((consumer) => {
    const matchesSearch =
      consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consumer.phone.includes(searchTerm);
    return matchesSearch;
  });

  const totalConsumers = consumers.length;
  const messageDeliverySuccessful = 4; // Static value since we removed message status
  const messageDeliveryFailed = 2; // Static value since we removed message status
  const consumersCompleting1Year = 5; // Static value since we removed year completed

  const columns = useConsumersTableColumn();
  const table = useReactTable({
    manualPagination: true,
    data: filteredConsumers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Consumers</h1>
        <p className="text-muted-foreground">
          Track consumer engagement and program completion
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Consumers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConsumers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Message Delivery Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {messageDeliverySuccessful}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Message Delivery Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {messageDeliveryFailed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Consumers Completing 1 Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {consumersCompleting1Year}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search consumers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Consumer List</CardTitle>
              <div className="text-sm text-muted-foreground">
                Showing {filteredConsumers.length} of {consumers.length}{' '}
                consumers
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
