import { UUID } from "crypto";
import ActivityCard from "./activity.card";
import { ScrollArea } from "@rahat-ui/shadcn/src/components/ui/scroll-area";
import { cn } from "@rahat-ui/shadcn/src";

type IProps = {
    projectId: UUID;
    data: Array<any>;
    gridClass?: string;
}

export default function ActivitiesListCard({ data, projectId, gridClass }: IProps) {
    return (
        <div className="bg-card p-4 pr-2 rounded">
            <h1 className="font-semibold text-lg mb-4">Activity List</h1>
            <ScrollArea className="relative h-[calc(100vh-393px)] pr-2">
                {data?.length ? (
                    <div className={cn("grid gap-4", gridClass)}>
                        {data?.map((item: any) => {
                            const activityType = item.isAutomated ? "Automated" : "Manual";
                            return (
                                <ActivityCard
                                    key={item.id}
                                    projectId={projectId}
                                    activityId={item.uuid}
                                    title={item.title}
                                    status={item.status}
                                    type={activityType}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground text-xl font-bold opacity-50">No Activities.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}