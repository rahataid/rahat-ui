import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { humanizeString } from '../../utils';
import ExtraInfoCard from './ExtraInfo';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { format } from 'date-fns';
import { CircleCheck, CircleCheckBig } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

type IProps = {
  data: any;
};

export default function InfoCards({ data }: IProps) {
  return (
    // <div
    //   style={{ maxHeight: '100vh' }}
    //   className="grid grid-cols-1 gap-4 p-2 overflow-y-auto"
    // >
    <div className="h-withPage grid gap-4 p-2">
      <ScrollArea>
        <Card className="shadow-md rounded-sm mb-2">
          <CardHeader>
            <div className="flex justify-between">
              <p>Basic Details</p>
              {/* <Badge variant="outline" color="red">
              Not Approved
            </Badge> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <p className="text-xs flex gap-1 items-center">
                {truncateEthAddress(data?.walletAddress) || 'N/A'}
                {data?.isVerified && <CircleCheck size={13} color="green" />}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Wallet Address
              </p>
            </div>

            <div className="flex justify-between gap-8">
              <div className="flex flex-col gap-2">
                <div>
                  <p>{humanizeString(data?.gender)}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Gender
                  </p>
                </div>
                <div>
                  <p>{humanizeString(data?.phoneStatus)}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Phone Status
                  </p>
                </div>
                <div>
                  <p>{humanizeString(data?.internetStatus)}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Internet Status
                  </p>
                </div>
                <div>
                  <p>{data?.govtIDType || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Govt. ID Type
                  </p>
                </div>
                <div>
                  <p>{data?.latitude || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Latitude
                  </p>
                </div>
                <div>
                  <p>{data?.location || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Location
                  </p>
                </div>
                <div>
                  <p>
                    {data && data.createdAt
                      ? format(data.createdAt, 'MMMM do, yyyy')
                      : 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Created At
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p>{data?.email || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Email
                  </p>
                </div>

                <div>
                  <p>{data?.phone || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Phone
                  </p>
                </div>
                <div>
                  <p>{humanizeString(data?.bankedStatus)}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Bank Status
                  </p>
                </div>
                <div>
                  <p>{data?.govtIDNumber || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Govt ID Number
                  </p>
                </div>
                <div>
                  <p>{data?.longitude || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Longitude
                  </p>
                </div>
                <div>
                  <p>{data?.notes || 'N/A'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Notes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(data?.extras || {}).length > 0 && data?.extras && (
          <ExtraInfoCard data={data?.extras} />
        )}
      </ScrollArea>
    </div>
  );
}
