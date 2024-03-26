'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/components/dialog';
import { useProjectAction } from '../../../../../libs/query/src/lib/projects/projects';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { MoreVertical } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { MS_ACTIONS } from '@rahataid/sdk';

export default function InfoCards({ data, voucherData }) {
  const addBeneficiary = useProjectAction();

  const handleAssignClaims = async () => {
    const walletAddress = data.walletAddress || '';

    // Remove fetching uuid from env
    const uuid = process.env.NEXT_PUBLIC_PROJECT_UUID;

    const result = await addBeneficiary.mutateAsync({
      uuid,
      data: {
        action: MS_ACTIONS.BENEFICIARY.ASSGIN_TO_PROJECT,
        payload: {
          beneficiaryId: data?.uuid,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 py-2 pl-2">
      <Card className="shadow rounded">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col items-start justify-start">
              <p>Beneficiary Name</p>
              <Badge variant="outline" className="bg-secondary">
                Not Approved
              </Badge>
            </div>
            <Button onClick={handleAssignClaims}>Assign To Project</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-xs">
                  {truncateEthAddress(data?.walletAddress) ?? 'N/A'}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Wallet Address
                </p>
              </div>
              <div>
                <p>{data?.bankStatus ?? 'test'}</p>
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
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p>{data?.gender ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
              </div>

              <div>
                <p>{data?.location ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Location
                </p>
              </div>
              <div>
                <p>{data?.phoneStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone Status
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow rounded">
        <CardHeader>
          <p className="font-mediun text-md">Projects Involved</p>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" color="secondary" className="rounded">
            Test Project
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
