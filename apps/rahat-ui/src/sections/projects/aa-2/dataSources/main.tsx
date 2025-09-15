'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react';

import { Heading } from 'apps/rahat-ui/src/common';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import { cn } from '@rahat-ui/shadcn/src';

import { DailyMonitoringListView } from './components/dailyMonitoring';
import { DHMSection } from './components/dhm';
import ExternalLinks from './components/externalLink/linkContent';
import GaugeReading from './components/gaugeReading';
import GFHDetails from './components/gfh';
import { GlofasSection } from './components/glofas';
import { useParams } from 'next/navigation';
import { PROJECT_SETTINGS_KEYS, useTabConfiguration } from '@rahat-ui/query';
import { UUID } from 'crypto';

const componentMap = {
  dhm: DHMSection,
  glofas: GlofasSection,
  dailyMonitoring: DailyMonitoringListView,
  gaugeReading: GaugeReading,
  gfh: GFHDetails,
  externalLinks: ExternalLinks,
};

type ComponentKey = keyof typeof componentMap;

interface BackendTab {
  value: ComponentKey;
  label: string;
  hasdatepicker?: boolean;
}

function DatePicker({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: (val: Date | null) => void;
}) {
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
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
            onSelect={(val) => val && setDate(val)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {date && (
        <Button
          variant="outline"
          className="ml-2 text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400"
          onClick={() => setDate(null)}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Clear Date
        </Button>
      )}
    </div>
  );
}

export default function DataSources() {
  const { activeTab, setActiveTab } = useActiveTab('dhm');
  const [date, setDate] = useState<Date | null>(null);
  const { id: projectID } = useParams();
  const { data } = useTabConfiguration(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.FORECAST_TAB_CONFIG,
  );

  // Backend tabs OR default fallback
  const backendTabs: BackendTab[] =
    data?.value?.length > 0
      ? data.value
      : [
          { value: 'dhm', label: 'DHM' },
          { value: 'glofas', label: 'GLOFAS' },
        ];

  const availableTabsConfig = backendTabs
    .filter((tab) => componentMap[tab.value]) // remove invalid backend tabs
    .map((tab) => ({
      ...tab,
      component: componentMap[tab.value],
    }));

  useEffect(() => {
    if (
      activeTab &&
      !availableTabsConfig.find((tab) => tab.value === activeTab)?.hasdatepicker
    ) {
      setDate(null);
    }
  }, [activeTab, availableTabsConfig]);

  return (
    <div className="p-4">
      <Heading
        title="Forecast Data"
        description="Track all the data sources reports here"
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between">
          {/* 🔹 Tab Triggers */}
          <TabsList className="border bg-secondary rounded mb-2">
            {availableTabsConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 🔹 Dynamic Date Picker (based on hasdatepicker) */}
          {availableTabsConfig.find(
            (tab) => tab.value === activeTab && tab.hasdatepicker,
          ) && <DatePicker date={date} setDate={setDate} />}
        </div>

        {/* 🔹 Tab Contents */}
        {availableTabsConfig.map((tab) => {
          const Component = tab.component;
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <Component date={date} />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
