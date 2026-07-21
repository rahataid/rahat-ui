import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useTranslations } from 'next-intl';
import TemperatureWatchView from './temperature.watch.view';
import HumidityWatchView from './humidity.watch.view';

export function AWSSection() {
  const t = useTranslations('AA Project');
  return (
    <Tabs defaultValue="temperatureWatch">
      <TabsList className="mb-2">
        <TabsTrigger
          className="w-full data-[state=active]:bg-white data-[state=active]:rounded-none data-[state=active]:border-b data-[state=active]:border-b-primary"
          value="temperatureWatch"
        >
          {t('TEMPERATURE_WATCH')}
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white data-[state=active]:rounded-none data-[state=active]:border-b data-[state=active]:border-b-primary"
          value="humidityWatch"
        >
          {t('RELATIVE_HUMIDITY')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="temperatureWatch">
        <TemperatureWatchView />
      </TabsContent>
      <TabsContent value="humidityWatch">
        <HumidityWatchView />
      </TabsContent>
    </Tabs>
  );
}