'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import AACategoriesView from './categories/categories.view';
import AAProjectPhasesView from './aa.phases';
import { useSearchParams } from 'next/navigation';

export default function AAProjectSettingsView() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'categories';

  return (
    <div className="p-4">
      <Tabs defaultValue={tab || 'categories'}>
        <TabsList className="border bg-secondary rounded">
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
