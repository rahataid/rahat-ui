import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@rahat-ui/shadcn/components/tabs';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import { IUserItem } from '../../types/user';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import ConfirmDialog from '../../components/dialog';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import Image from 'next/image';

type IProps = {
  data: IUserItem;
};

export default function UserDetail({ data }: IProps) {
  return (
    <>
      <Tabs defaultValue="detail" className="h-full">
        <div className="flex justify-between items-center p-1">
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
            <TabsTrigger value="edit-user">Edit</TabsTrigger>
          </TabsList>
          <Dialog>
            <DialogTrigger asChild className=" ml-4">
              <Trash2 className="cursor-pointer" size={18} strokeWidth={1.5} />
            </DialogTrigger>
            <ConfirmDialog name="user" />
          </Dialog>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full"
                src="/svg/funny-cat.svg"
                alt="cat"
                height={80}
                width={80}
              />
              <h1 className="font-semibold text-xl">{data.name}</h1>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-slate-500">{data.email}</p>
            <p className="text-slate-500">
              {data.walletaddress
                ? data.walletaddress.slice(0, 4) +
                  '...' +
                  data.walletaddress.slice(-4)
                : 'N/A'}
            </p>
          </div>
        </div>
        <TabsContent value="detail">
          <div className="border-y flex items-center justify-between flex-wrap mx-4 py-4 gap-3">
            <div>
              <p className="font-light text-base">{data.name}</p>
              <p className="text-sm font-normal text-muted-foreground ">Name</p>
            </div>
            <div>
              <p className="font-light text-base">{'Male'}</p>
              <p className="text-sm font-normal text-muted-foreground ">
                Gender
              </p>
            </div>
            <div>
              <p className="font-light text-base">{data.email || 'N/A'}</p>
              <p className="text-sm font-normal text-muted-foreground ">
                Email
              </p>
            </div>
            <div>
              <p className="font-light text-base">{'986758465'}</p>
              <p className="text-sm font-normal text-muted-foreground ">
                Phone
              </p>
            </div>
            <div>
              <p className="font-light text-base">
                {data.walletaddress ||
                  '0xAC6bFaf10e89202c293dD795eCe180BBf1430d7B'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Wallet
              </p>
            </div>
          </div>
          {/* <div className="grid grid-cols-2 border-y font-light">
            <div className="border-r p-4 flex flex-col gap-2 ">
              <p>Name</p>
              <p>Gender</p>
              <p>Email</p>
              <p>Phone</p>
              <p>Wallet</p>
              <p>Roles</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <p>{data.name}</p>
              <p>{'Male'}</p>
              <p>{data.email}</p>
              <p>{'98449586948'}</p>
              <p>{data.walletaddress || 'Not Available'}</p>
              <ul>
                <li>Admin</li>
                <li>Manager</li>
                <li>Admin</li>
                <li>Manager</li>
              </ul>
            </div>
          </div> */}
        </TabsContent>
        <TabsContent
          value="edit-user"
          className="flex flex-col justify-between min-h-[40vh] overflow-y-auto  max-h-[80vh]"
        >
          <div>
            <div className="p-4 border-y">
              <Input className="mt-1" type="name" placeholder="Name" />
              <Input className="mt-3" type="email" placeholder="Email" />
              <Input
                className="mt-3"
                type="walletaddress"
                placeholder="Walletaddress"
              />
            </div>
            <div className="p-4 flex items-center justify-start gap-24">
              <div className="flex items-center gap-2">
                <Switch id="approve" />
                <Label htmlFor="airplane-mode">Approve</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="disable" />
                <Label htmlFor="airplane-mode">Disable</Label>
              </div>
            </div>
          </div>
          <div className="p-4 border-t flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="disable-user" />
              <Label htmlFor="disable-user">Add as owner</Label>
            </div>
            <Button>Confirm</Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
