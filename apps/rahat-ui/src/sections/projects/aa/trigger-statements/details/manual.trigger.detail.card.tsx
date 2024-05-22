import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IProps = {
  status: boolean;
  notes: string;
  phase: string;
};

export default function ManualTriggerDetailCard({
  status,
  notes,
  phase,
}: IProps) {
  return (
    <div className="bg-card rounded p-4">
      <h1 className="font-medium mb-4">Trigger Details</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge
            className={
              status ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }
          >
            {status ? 'Triggered' : 'Not Triggered'}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Trigger Type</p>
          <p>Manual</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Phase</p>
          <p>{phase}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Notes</p>
          <p>{notes ? notes : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
