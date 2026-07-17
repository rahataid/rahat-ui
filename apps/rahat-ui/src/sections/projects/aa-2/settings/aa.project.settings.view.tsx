'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import AASettingsView from './settings.view';
import AACategoriesView from './categories/categories.view';
import AAProjectPhasesView from './aa.phases';
import { useSearchParams } from 'next/navigation';

export default function AAProjectSettingsView() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'settings';

  return (
    <div className="p-4">
      <Tabs defaultValue={tab || 'settings'}>
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="settings"
          >
            Settings
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="categories"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="phases"
          >
            Phases
          </TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <AASettingsView />
        </TabsContent>
        <TabsContent value="categories">
          <AACategoriesView />
        </TabsContent>
        <TabsContent value="phases">
          <AAProjectPhasesView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
