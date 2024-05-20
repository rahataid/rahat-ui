import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function TriggerActivityListCard({ triggerDetail }: any) {
  const router = useRouter();
  const { id: projectID } = useParams();

  const navigateToDetails = (activityId: string) => {
    router.push(`/projects/aa/${projectID}/activities/${activityId}`);
  };

  return (
    <div className="bg-card p-4 rounded">
      <h1 className="font-semibold text-lg">Activity List</h1>
      <div>
        {triggerDetail?.activities?.map((item: any) => {
          return (
            <div
              key={item.id}
              className="p-4 rounded-md bg-secondary mt-4 hover:underline hover:cursor-pointer"
              onClick={() => {
                navigateToDetails(item.uuid);
              }}
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
        })}
      </div>
    </div>
  );
}
