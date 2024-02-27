import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

type IProps = {
  name?: string;
  type?: string;
  startTime?: string;
  status?: string;
  totalAudience?: number;
};

export const InfoCard: React.FC<IProps> = ({
  name,
  type,
  startTime,
  status,
  totalAudience,
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p>{type}</p>
            <p className="text-sm font-light">Type</p>
          </div>
          <div>
            <p>{startTime}</p>
            <p className="text-sm font-light">Start Time</p>
          </div>
          <div>
            <p>{status}</p>
            <p className="text-sm font-light">Status</p>
          </div>
          <div>
            <p>{totalAudience}</p>
            <p className="text-sm font-light">Total Audiences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
