import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { humanizeString } from '../../utils';

export default function ExtraInfoCard({ data }: any) {
  return (
    <Card className="shadow-md rounded-sm">
      <CardHeader>
        <div className="flex justify-between">
          <p>Extra Details</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="col-span-1">
              <p>{(value as string).toString()}</p>
              <p className="text-sm font-normal text-muted-foreground">
                {humanizeString(key)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
