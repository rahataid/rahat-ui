'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import AASettingsView from './settings.view';
import AACategoriesView from './categories/categories.view';

export default function AAProjectSettingsView() {
  return (
    <div className="p-4">
      <Tabs defaultValue="settings">
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
        </TabsList>
        <TabsContent value="settings">
          <AASettingsView />
        </TabsContent>
        <TabsContent value="categories">
          <AACategoriesView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
