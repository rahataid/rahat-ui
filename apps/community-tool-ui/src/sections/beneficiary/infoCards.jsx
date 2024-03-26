import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';

export default function InfoCards({ data }) {
  console.log(data);
  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      <Card className="shadow-md rounded-sm">
        <CardHeader>
          <div className="flex justify-between">
            <p>{`${data?.firstName} ${data?.lastName}`}</p>
            <Badge variant="outline" color="red">
              Not Approved
            </Badge>
          </div>

          <div className="mt-1 mb-2">
            <p className="text-xs">{data?.customId}</p>
            <p className="text-sm font-normal text-muted-foreground">
              Custom Id
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <p className="text-xs">
              {truncateEthAddress(data?.walletAddress) ?? 'N/A'}
            </p>
            <p className="text-sm font-normal text-muted-foreground">
              Wallet Address
            </p>
          </div>

          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div>
                <p>{data?.gender ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
              </div>
              <div>
                <p>{data?.bankedStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Bank Status
                </p>
              </div>
              <div>
                <p>{data?.internetStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Internet Status
                </p>
              </div>
              <div>
                <p>{data?.phoneStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone Status
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p>{data?.phone ?? 'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone
                </p>
              </div>
              <div>
                <p>{data?.email ?? 'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Email
                </p>
              </div>
              <div>
                <p>{data?.location ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Location
                </p>
              </div>
              <div>
                <p>{data?.notes ? data?.notes : 'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Notes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
