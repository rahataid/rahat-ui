import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { DHMView } from './DHM';
import { GlofasView } from './glofas';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useDhmWaterLevels,
  useGlofasWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { DailyMonitoringListView } from './daily-monitoring';
import { useTranslations } from 'next-intl';

export default function DataSourcesView() {
  const t = useTranslations('AA_PROJECT');
  const { id } = useParams();
  const projectID = id as UUID;
  const { isLoading: isLoadingDhm, data: dhmData } =
    useDhmWaterLevels(projectID);

  const { isLoading: isLoadingGlofas, data: glofasData } =
    useGlofasWaterLevels(projectID);

  const dataSourceSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectID]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );

  const dhmDangerLevel = dataSourceSettings?.dhm?.danger_level;
  const stationLocation = dataSourceSettings?.glofas?.location;

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <h1 className="text-xl font-semibold">{t('DATA_SOURCES')}</h1>
      <p className="text-muted-foreground text-sm">
        {t('SELECT_DATA_SOURCE')}
      </p>
      <Tabs defaultValue="dhm">
        <TabsList className="bg-secondary gap-4 mt-4 mb-2">
          <TabsTrigger
            value="dhm"
            className="w-36 border bg-card data-[state=active]:border-primary"
          >
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>{t('DHM')}</TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">
                    {t('DHM_FULL')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>

          <TabsTrigger
            value="glofas"
            className="w-36 border bg-card data-[state=active]:border-primary"
          >

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>{t('GLOFAS')}</TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">
                    {t('GLOFAS_FULL')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>

          <TabsTrigger
            id="monitoring"
            value="dailyMonitoring"
            className="w-36 border bg-card data-[state=active]:border-primary"
          >
            {t('DAILY_MONITORING')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="glofas">
          {isLoadingDhm ? (
            t('LOADING_GLOFAS_DATA')
          ) : (
            <GlofasView location={stationLocation} glofasData={glofasData} />
          )}
        </TabsContent>
        <TabsContent value="dhm">
          {isLoadingDhm ? t('LOADING_DHM_DATA') : <DHMView data={dhmData} dhmDangerLevel={dhmDangerLevel} />}
        </TabsContent>
        <TabsContent value="dailyMonitoring">
          <DailyMonitoringListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
