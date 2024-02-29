import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';

import { MoreVertical } from 'lucide-react';
import data from '../../app/beneficiary/beneficiaryData.json';

export default function InfoCards() {
  return (
    <div className="grid gap-4 p-2">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between">
            <p>Name</p>
            <Badge variant="outline" color="red">
              Not Approved
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p>{data.walletAddress ?? 'test'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Wallet Address
              </p>
            </div>
            <div>
              <p>{data.gender ?? 'test'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Gender
              </p>
            </div>
            <div>
              <p>{data.bankStatus ?? 'test'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Bank Status
              </p>
            </div>
            <div>
              <p>{data.location ?? 'test'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Location
              </p>
            </div>
            <div>
              <p>{data.internetStatus ?? 'test'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Internet Status
              </p>
            </div>
            <div>
              <p>{data.phoneStatus ?? 'test'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Phone Status
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <p>Claim Details</p>
            <MoreVertical />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <p>Claimed</p>
              <p className="text-sm font-light">0</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Received</p>
              <p className="text-sm font-light">0</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Wallet Address</p>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-sm font-medium">87654eu87654edgh76</p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary ">
                    <p className="text-xs font-medium">click to copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <p className="fonr-mediun text-md">Projects Involved</p>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" color="secondary" className="p-2">
            Test Project
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
