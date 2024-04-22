import { Tabs, TabsList, TabsTrigger, TabsContent } from "@rahat-ui/shadcn/src/components/ui/tabs"
import { DHMView } from "./DHM"

export default function DataSourcesView() {
    return (
        <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
            <Tabs defaultValue="dhm" className="w-full">
                <TabsList className="w-1/2 grid grid-cols-3">
                    <TabsTrigger value="dhm">DHM</TabsTrigger>
                    <TabsTrigger value="glofas">GLoFAS</TabsTrigger>
                    <TabsTrigger value="ncwrmf">NCWRMF</TabsTrigger>
                </TabsList>
                <TabsContent value="dhm"><DHMView /></TabsContent>
                <TabsContent value="glofas">GLoFAS View</TabsContent>
                <TabsContent value="ncwrmf">NCWRMF View</TabsContent>
            </Tabs>
        </div>
    )
}