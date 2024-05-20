import { Plus } from "lucide-react";
import PhaseTriggersListView from "./phase.triggers.list.view";
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";

export default function PhaseDetailView() {
    return (
        <div className="p-2 h-[calc(100vh-65px)] bg-secondary">
            <div className="mb-4">
                <h1 className="font-semibold text-lg mb-2">Phase Name</h1>
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
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg mb-2">Triggers List</h1>
                    <Button variant="ghost" className="text-primary gap-1 text-md">
                        <Plus size={20} />
                        <p>Select Triggers</p>
                    </Button>
                </div>
                <PhaseTriggersListView />
            </div>
        </div>
    )
}