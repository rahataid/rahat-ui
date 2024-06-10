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

export default function DataSourcesView() {
  const { id } = useParams();
  const projectID = id as UUID;
  const { isLoading: isLoadingDhm, data: dhmData } =
    useDhmWaterLevels(projectID);

  const { isLoading: isLoadingGlofas, data: glofasData } =
    useGlofasWaterLevels(projectID);

  const dataSourceSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectID]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );
  const stationLocation = dataSourceSettings?.glofas?.location;

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <h1 className="text-xl font-semibold">Data Sources</h1>
      <p className="text-muted-foreground text-sm">
        Select a data source to view the detail view
      </p>
      <Tabs defaultValue="glofas">
        <TabsList className="bg-secondary gap-4 mt-4 mb-2">
          <TabsTrigger
            value="glofas"
            className="w-36 border bg-card data-[state=active]:border-primary"
          >
            GLoFAS
          </TabsTrigger>
          <TabsTrigger
            value="dhm"
            className="w-36 border bg-card data-[state=active]:border-primary"
          >
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>DHM</TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">
                    Department of Hydrology and Meteorology
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger
            value="dailyMonitoring"
            className="w-36 border bg-card data-[state=active]:border-primary"
          >
            Daily Monitoring
          </TabsTrigger>
        </TabsList>
        <TabsContent value="glofas">
          {isLoadingDhm ? (
            'Loading GloFAS data...'
          ) : (
            <GlofasView location={stationLocation} glofasData={glofasData} />
          )}
        </TabsContent>
        <TabsContent value="dhm">
          {isLoadingDhm ? 'Loading DHM data...' : <DHMView data={dhmData} />}
        </TabsContent>
        <TabsContent value="dailyMonitoring">
          <DailyMonitoringListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
