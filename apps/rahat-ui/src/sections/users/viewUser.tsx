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

type IProps = {
  data: IUserItem;
};

export default function UserDetail({ data }: IProps) {
  console.log(data);
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
              <Button variant="outline" className="rounded">
                Delete User
              </Button>
            </DialogTrigger>
            <ConfirmDialog name="user" />
          </Dialog>
        </div>
        <div className="p-4">
          <div className="flex">
            <h1 className="font-semibold text-xl">{data.name}</h1>
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
          <div className="grid grid-cols-2 border-y font-light">
            <div className="border-r p-4 flex flex-col gap-2 ">
              <p>Name</p>
              <p>Verified</p>
              <p>Updated Date</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <p>{'data.walletAddress'}</p>
              <p>{'False'}</p>
              <p>{'formattedDate'}</p>
            </div>
          </div>
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
