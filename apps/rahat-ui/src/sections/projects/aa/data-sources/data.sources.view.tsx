import { Tabs, TabsList, TabsTrigger, TabsContent } from "@rahat-ui/shadcn/src/components/ui/tabs"
import { DHMView } from "./DHM"
import { useParams } from "next/navigation"
import { UUID } from "crypto"
import { useDhmWaterLevels } from "@rahat-ui/query"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@rahat-ui/shadcn/src/components/ui/tooltip"

export default function DataSourcesView() {
    const { id } = useParams()
    const projectID = id as UUID
    const { isLoading: isLoadingDhm, data: dhmData } = useDhmWaterLevels(projectID)

    return (
        <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
            <Tabs defaultValue="dhm" className="w-full">
                <TabsList className="w-1/2 grid grid-cols-3">
                    <TabsTrigger value="dhm">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger>
                                    DHM
                                </TooltipTrigger>
                                <TooltipContent className="bg-secondary ">
                                    <p className="text-xs font-medium">Department of Hydrology and Meteorology</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TabsTrigger>
                    <TabsTrigger value="glofas">GLoFAS</TabsTrigger>
                    <TabsTrigger value="ncwrmf">NCWRMF</TabsTrigger>
                </TabsList>
                <TabsContent value="dhm">
                    {
                        isLoadingDhm ? (
                            "Loading DHM data..."
                        ) : (
                            <DHMView data={dhmData} />
                        )
                    }
                </TabsContent>
                <TabsContent value="glofas">GLoFAS View</TabsContent>
                <TabsContent value="ncwrmf">NCWRMF View</TabsContent>
            </Tabs>
        </div>
    )
}