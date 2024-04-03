import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';

export default function InfoCards({ data }) {
  const changedDate = new Date(data?.createdAt);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      <Card className="shadow-md rounded-sm">
        {/* <CardHeader>
          <div className="flex justify-between">
            <p>{`${data?.firstName} ${data?.lastName}`}</p>
            <Badge variant="outline" color="red">
              Not Approved
            </Badge>
          </div>
        </CardHeader> */}
        <CardContent>
          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div>
                <p>{data?.name ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Name
                </p>
              </div>
              <div>
                <p>{data?.fieldType ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  FieldType
                </p>
              </div>
              <div>
                <p>{formattedDate ?? 'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  CreateAt
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
