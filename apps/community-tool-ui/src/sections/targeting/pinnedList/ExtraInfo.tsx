import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { humanizeString, isURL } from '../../../utils';

export default function ExtraInfoCard({ data }: any) {
  function renderExtraField(value: any) {
    const isUrl = isURL(value);
    if (isUrl)
      return (
        <a className="text-blue-400" href={value} target="_blank">
          Open Link
        </a>
      );
    return value.toString();
  }
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
            <div key={index} className="col-span-1">
              <p>{renderExtraField(value)}</p>
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
