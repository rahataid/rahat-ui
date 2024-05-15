import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export default function TriggerActivityListCard({ triggerDetail }: any) {
  return (
    <div className="bg-card p-4 rounded">
      <h1 className="font-semibold text-lg">Activity List</h1>
      <div>
        {triggerDetail?.activities?.map((item: any) => (
          <div key={item.id} className="p-4 rounded-md bg-secondary mt-4">
            <h1 className="font-medium">{item.title}</h1>
            <p className="text-muted-foreground text-sm mb-1">
              {item.activityType}
            </p>
            <Badge
              className={
                item.status === 'NOT_STARTED' ? 'bg-red-100 text-red-700' : ''
              }
            >
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
