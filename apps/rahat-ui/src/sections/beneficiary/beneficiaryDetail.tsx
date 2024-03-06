import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Archive, Expand, FilePenLine, Minus, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/dialog';
import { paths } from '../../routes/paths';
import { IBeneficiaryItem } from '../../types/beneficiary';
import EditBeneficiary from './editBeneficiary';
import InfoCards from './infoCards';

type IProps = {
  data: IBeneficiaryItem;
  handleClose: VoidFunction;
};

export default function BeneficiaryDetail({ data, handleClose }: IProps) {
  const router = useRouter();

  const changedDate = new Date(data?.updatedAt);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={handleClose}>
                  <Minus size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    router.push(
                      paths.dashboard.beneficiary.detail(data.walletAddress)
                    );
                  }}
                >
                  <Expand size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Expand</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <FilePenLine size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Archive size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Archive</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <Button variant="outline">Delete User</Button> */}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Trash2 size={20} strokeWidth={1.5} />
                    </DialogTrigger>
                    <ConfirmDialog name="beneficiary" />
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
            <TabsTrigger value="transaction-history">
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
        </div>
        {/* <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <Image
              className="rounded-full"
              src="/svg/funny-cat.svg"
              alt="cat"
              height={80}
              width={80}
            />
            <div className="my-auto">
              <h1 className="font-semibold text-xl mb-2">
                {data.walletAddress}
              </h1>
              <div className="flex justify-between">
                <p>Edit</p>
                <p>Delete</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-slate-500">
              {formattedDate}
              <br />
              Last updated
            </p>
          </div>
        </div> */}
        <TabsContent value="detail">
          {/* <div className="grid grid-cols-2 border-y font-light">
            <div className="border-r p-4 flex flex-col gap-2 ">
              <p>Name</p>
              <p>Verified</p>
              <p>Updated Date</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <p>{data.walletAddress}</p>
              <p>{data.verified ? 'True' : 'False'}</p>
              <p>{formattedDate}</p>
            </div>
          </div> */}
          {/* <Card className="shadow-md m-2">
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
          </Card> */}
          <InfoCards data={data} />
        </TabsContent>
        <TabsContent value="transaction-history">
          <div className="p-4 border-y">Transaction History View</div>
        </TabsContent>
        <TabsContent value="edit">
          <EditBeneficiary />
        </TabsContent>
        {/* <div className="p-6 flex justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="disable-user" />
            <Label htmlFor="disable-user">Disable this user</Label>
          </div>
          <Button>Confirm</Button>
        </div> */}
      </Tabs>
    </>
  );
}
