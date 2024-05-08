import { Badge } from "@rahat-ui/shadcn/src/components/ui/badge";

export default function TriggerActivityListCard() {

    const triggerActivityData = [
        {
            title: 'Preparedness Activity demo 1',
            category: "General Action",
            badge: <Badge className="bg-green-100 text-green-700">Completed</Badge>
        },
        {
            title: 'Preparedness Activity demo 2',
            category: "General Action",
            badge: <Badge className="bg-red-100 text-red-700">Not started</Badge>
        },
        {
            title: 'Preparedness Activity demo 3',
            category: "General Action",
            badge: <Badge className="bg-yellow-100 text-yellow-700">Work in progress</Badge>
        }
    ]

    return (
        <div className="bg-card p-4 rounded">
            <h1 className="font-semibold text-lg">Activity List</h1>
            <div>
                {triggerActivityData.map((item) => (
                    <div className="p-4 rounded-md bg-secondary mt-4">
                        <h1 className="font-medium">{item.title}</h1>
                        <p className="text-muted-foreground text-sm mb-1">{item.category}</p>
                        <div>{item.badge}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}