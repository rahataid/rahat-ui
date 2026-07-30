import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import RiverWatchView from './river.watch.view';
import RainfallWatchView from './rainfall.watch.view';

export function DHMSection() {
  const t = useTranslations('AA_PROJECT');
  return (
    <Tabs defaultValue="riverWatch">
      <TabsList className="mb-2">
        <TabsTrigger
          className="w-full data-[state=active]:bg-white data-[state=active]:rounded-none data-[state=active]:border-b data-[state=active]:border-b-primary"
          value="riverWatch"
        >
          {t('RIVER_WATCH')}
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white data-[state=active]:rounded-none data-[state=active]:border-b data-[state=active]:border-b-primary"
          value="rainfallWatch"
        >
          {t('RAINFALL_WATCH')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="riverWatch">
        <RiverWatchView />
      </TabsContent>
      <TabsContent value="rainfallWatch">
        <RainfallWatchView />
      </TabsContent>
    </Tabs>
  );
}
