import { Badge } from "@rahat-ui/shadcn/src/components/ui/badge"
import { ScrollArea } from "@rahat-ui/shadcn/src/components/ui/scroll-area"
import { Button } from "@rahat-ui/shadcn/src/components/ui/button"

export default function ActivityCommunicationListCard() {
    return (
        <div className="bg-card p-4 rounded">
            <h1 className="font-semibold text-lg">Communication List</h1>
            <ScrollArea className="h-[calc(100vh-310px)]">
                <div className="p-4 rounded-md bg-secondary mt-4">
                    <div className="flex justify-between items-center">
                        <h1 className="font-medium text-primary">Group Name</h1>
                        <Button type="button" className="h-7">
                            Trigger
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h1 className="text-muted-foreground text-sm">Group Type</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Communication</h1>
                            <p>Demo</p>
                        </div>
                        <div>
                            <h1 className="text-muted-foreground text-sm">Message</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Status</h1>
                            <Badge className="bg-orange-100 text-orange-600">ONGOING</Badge>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-md bg-secondary mt-4">
                    <div className="flex justify-between items-center">
                        <h1 className="font-medium text-primary">Group Name</h1>
                        <Button type="button" className="h-7">
                            Trigger
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h1 className="text-muted-foreground text-sm">Group Type</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Communication</h1>
                            <p>Demo</p>
                        </div>
                        <div>
                            <h1 className="text-muted-foreground text-sm">Message</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Status</h1>
                            <Badge className="bg-orange-100 text-orange-600">ONGOING</Badge>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-md bg-secondary mt-4">
                    <div className="flex justify-between items-center">
                        <h1 className="font-medium text-primary">Group Name</h1>
                        <Button type="button" className="h-7">
                            Trigger
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h1 className="text-muted-foreground text-sm">Group Type</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Communication</h1>
                            <p>Demo</p>
                        </div>
                        <div>
                            <h1 className="text-muted-foreground text-sm">Message</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Status</h1>
                            <Badge className="bg-orange-100 text-orange-600">ONGOING</Badge>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-md bg-secondary mt-4">
                    <div className="flex justify-between items-center">
                        <h1 className="font-medium text-primary">Group Name</h1>
                        <Button type="button" className="h-7">
                            Trigger
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h1 className="text-muted-foreground text-sm">Group Type</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Communication</h1>
                            <p>Demo</p>
                        </div>
                        <div>
                            <h1 className="text-muted-foreground text-sm">Message</h1>
                            <p>Demo</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-muted-foreground text-sm">Status</h1>
                            <Badge className="bg-orange-100 text-orange-600">ONGOING</Badge>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}