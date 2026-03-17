'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@rahat-ui/shadcn/components/card';
import { Input } from '@rahat-ui/shadcn/components/input';
import DemoTable from 'apps/rahat-ui/src/components/table';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useConsumersTableColumn } from './useConsumersTableColumn';
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  CalendarCheck,
  X,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

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
  const messageDeliverySuccessful = 4;
  const messageDeliveryFailed = 2;
  const consumersCompleting1Year = 5;

  const statCards = [
    {
      title: 'Total Consumers',
      value: totalConsumers,
      icon: Users,
      color: 'text-foreground',
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Total number of consumers enrolled in the program',
    },
    {
      title: 'Delivery Successful',
      value: messageDeliverySuccessful,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/5',
      iconColor: 'text-success',
      tooltip: 'Messages successfully delivered to consumers',
    },
    {
      title: 'Delivery Failed',
      value: messageDeliveryFailed,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/5',
      iconColor: 'text-destructive',
      tooltip: 'Messages that failed to deliver to consumers',
    },
    {
      title: 'Completing 1 Year',
      value: consumersCompleting1Year,
      icon: CalendarCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Consumers who have completed 1 year in the program',
    },
  ];

  const columns = useConsumersTableColumn();
  const table = useReactTable({
    manualPagination: true,
    data: filteredConsumers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Consumers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track consumer engagement and program completion
          </p>
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
                        <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
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

          {/* Consumer Table Card */}
          <Card className="flex flex-col">
            {/* Search Bar */}
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 max-w-sm space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>
                {searchTerm && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchTerm('')}
                    className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                )}
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Showing results for:
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                    &quot;{searchTerm}&quot;
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {filteredConsumers.length} result
                    {filteredConsumers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Table */}
            <CardContent className="p-0">
              <DemoTable
                table={table}
                tableHeight="h-[calc(100vh-560px)]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
