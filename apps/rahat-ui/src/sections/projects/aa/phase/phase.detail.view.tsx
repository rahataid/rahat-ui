import { useParams } from "next/navigation";
import { useSinglePhase } from "@rahat-ui/query";
import PhaseTriggersListView from "./phase.triggers.list.view";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { Badge } from "@rahat-ui/shadcn/src/components/ui/badge";
import { Plus } from "lucide-react";
import { UUID } from "crypto";

export default function PhaseDetailView() {
    const { id: projectId, phaseId } = useParams();
    const { data: phaseDetail } = useSinglePhase(projectId as UUID, phaseId as UUID)

    return (
        <div className="p-2 h-[calc(100vh-65px)] bg-secondary">
            <div className="mb-4">
                <h1 className="font-semibold text-lg mb-2">{phaseDetail?.name}</h1>
                <div className="flex gap-2">
                    <div className="grid gap-2 px-4 py-2 bg-card rounded">
                        <h1 className="text-muted-foreground">Required Triggers</h1>
                        <p>0</p>
                    </div>
                    <div className="grid gap-2 px-4 py-2 bg-card rounded">
                        <h1 className="text-muted-foreground">Optional Triggers</h1>
                        <p>0</p>
                    </div>
                </div>
            </div>
            <Tabs defaultValue="triggers">
                <TabsList className="bg-secondary gap-4">
                    <TabsTrigger value="triggers" className='w-52 bg-card border data-[state=active]:border-primary'>
                        Triggers List
                    </TabsTrigger>
                    <TabsTrigger value="activities" className='w-52 bg-card border data-[state=active]:border-primary'>
                        Activities List
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="triggers">
                    <div>
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold text-lg mb-2">Triggers List</h1>
                            <Button variant="ghost" className="text-primary gap-1 text-md">
                                <Plus size={20} />
                                <p>Select Triggers</p>
                            </Button>
                        </div>
                        <PhaseTriggersListView triggersList={phaseDetail?.triggers} />
                    </div>
                </TabsContent>
                <TabsContent value="activities">
                    <div className="bg-card p-4 rounded">
                        <h1 className="font-semibold text-lg">Activity List</h1>
                        <div>
                            {phaseDetail?.activities?.length ?
                                phaseDetail?.activities?.map((item: any) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="p-4 rounded-md bg-secondary mt-4 hover:underline hover:cursor-pointer"
                                        >
                                            <h1 className="font-medium">{item.title}</h1>
                                            <p className="text-muted-foreground text-sm mb-1">
                                                {item.activityType}
                                            </p>
                                            <Badge
                                                className={
                                                    item.status === 'NOT_STARTED'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                }
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                    );
                                })
                                : <p className="text-muted-foreground text-sm">No Activities</p>}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}