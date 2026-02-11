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
import { useConsumers } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

export default function ConsumersView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [searchTerm, setSearchTerm] = useState('');

  const { data: consumers, isLoading } = useConsumers(projectUUID);

  // const filteredConsumers = consumers.filter((consumer: any) => {
  //   const matchesSearch =
  //     consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     consumer.phone.includes(searchTerm);
  //   return matchesSearch;
  // });

  const totalConsumers = consumers?.length || 0;
  const messageDeliverySuccessful = 0;
  const messageDeliveryFailed = 0;
  const consumersCompleting1Year = 0;

  const columns = useConsumersTableColumn();
  const table = useReactTable({
    manualPagination: true,
    data: consumers || [],
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
                Showing {totalConsumers} of {totalConsumers} consumers
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
