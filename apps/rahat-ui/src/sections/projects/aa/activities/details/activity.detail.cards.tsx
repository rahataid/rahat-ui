import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Info, Text, SignalHigh, Gauge } from 'lucide-react';

export default function ActivityDetailCards({ activityDetail }: any) {
    const detailCardData = [
        {
            title: 'Status',
            content: (
                <Badge className="bg-orange-100 text-orange-600">
                    {activityDetail?.status}
                </Badge>
            ),
            icon: <Info size={25} />,
        },
        {
            title: 'Source',
            content: (
                <p className="text-xl text-primary font-semibold">
                    {activityDetail?.source}
                </p>
            ),
            icon: <Text size={25} />,
        },
        {
            title: 'Phase',
            content: (
                <p className="text-xl text-primary font-semibold">
                    {activityDetail?.phase?.name}
                </p>
            ),
            icon: <SignalHigh size={25} />,
        },
        {
            title: 'Hazard Type',
            content: <p className="text-xl text-primary font-semibold">{activityDetail?.hazardType?.name}</p>,
            icon: <Gauge size={25} />,
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            {detailCardData.map((item) => (
                <div
                    key={item.title}
                    className="p-4 rounded bg-card flex items-center gap-4"
                >
                    <div className="p-3 bg-secondary text-primary rounded">
                        {item.icon}
                    </div>
                    <div>
                        <h1 className="font-medium">{item.title}</h1>
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
}