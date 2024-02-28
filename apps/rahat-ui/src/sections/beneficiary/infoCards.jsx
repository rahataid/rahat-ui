import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import { MoreVertical } from 'lucide-react';
import data from '../../app/beneficiary/beneficiaryData.json';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function InfoCards() {
  return (
    <div className="grid gap-4 p-4">
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
              <p className="text-sm font-medium">87654eu87654edgh76</p>
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
