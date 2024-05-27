import Link from "next/link";
import { Badge } from "@rahat-ui/shadcn/src/components/ui/badge";
import { UUID } from "crypto";

type IProps = {
    projectId: UUID;
    activityId: UUID;
    title: string;
    type: string;
    status: string;
}

export default function ActivityCard({ projectId, activityId, title, type, status }: IProps) {
    const activityDetailPath = `/projects/aa/${projectId}/activities/${activityId}`;
    return (
        <Link href={activityDetailPath}>
            <div
                className="p-4 rounded-md bg-secondary"
            >
                <h1 className="font-medium">{title}</h1>
                <p className="text-muted-foreground text-sm mb-1">
                    {type}
                </p>
                <Badge
                    className={
                        status === 'NOT_STARTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                    }
                >
                    {status}
                </Badge>
            </div>
        </Link>
    )
}