'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import { DHMSection, GlofasSection } from './components';
import { DailyMonitoringListView } from './components/dailyMonitoring';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import GaugeReading from './components/gaugeReading';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { cn } from '@rahat-ui/shadcn/src';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import { format } from 'date-fns';

export default function DataSources() {
  const { activeTab, setActiveTab } = useActiveTab('dhm');
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="p-4">
      <Heading
        title="Forecast Data"
        description="Track all the data sources reports here"
      />
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between">
          <TabsList className="border bg-secondary rounded mb-2">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              value="dhm"
            >
              DHM
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              value="glofas"
            >
              GLOFAS
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              value="dailyMonitoring"
            >
              Daily Monitoring
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              value="gaugeReading"
            >
              Gauge Reading
            </TabsTrigger>
          </TabsList>
          {activeTab === 'gaugeReading' && (
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date || undefined}
                    onSelect={(val) => {
                      if (!val) return;
                      setDate(val);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDate(null);
                  }}
                >
                  Clear date
                </Button>
              )}
            </div>
          )}
        </div>
        <TabsContent value="dhm">
          <DHMSection />
        </TabsContent>
        <TabsContent value="glofas">
          <GlofasSection />
        </TabsContent>
        <TabsContent value="dailyMonitoring">
          <DailyMonitoringListView />
        </TabsContent>
        <TabsContent value="gaugeReading">
          <GaugeReading date={date} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
