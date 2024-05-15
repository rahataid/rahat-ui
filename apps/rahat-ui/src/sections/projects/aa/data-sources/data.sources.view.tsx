import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { DHMView } from './DHM';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDhmWaterLevels } from '@rahat-ui/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function DataSourcesView() {
  const { id } = useParams();
  const projectID = id as UUID;
  const { isLoading: isLoadingDhm, data: dhmData } =
    useDhmWaterLevels(projectID);
    
  console.log(dhmData)

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <h1 className='text-xl font-semibold'>Data Sources</h1>
      <p className='text-muted-foreground text-sm'>Select a data source to view the detail view</p>
      <Tabs defaultValue="dhm">
        <TabsList className="bg-secondary gap-4 mt-4 mb-2">
          <TabsTrigger value="dhm" className='w-36 border bg-card data-[state=active]:border-primary'>
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
          <TabsTrigger value="glofas" className='w-36 border bg-card data-[state=active]:border-primary'>GLoFAS</TabsTrigger>
          <TabsTrigger value="ncwrmf" className='w-36 border bg-card data-[state=active]:border-primary'>NCWRMF</TabsTrigger>
        </TabsList>
        <TabsContent value="dhm">
          {isLoadingDhm ? 'Loading DHM data...' : <DHMView data={dhmData} />}
        </TabsContent>
        <TabsContent value="glofas">GLoFAS View</TabsContent>
        <TabsContent value="ncwrmf">NCWRMF View</TabsContent>
      </Tabs>
    </div>
  );
}
