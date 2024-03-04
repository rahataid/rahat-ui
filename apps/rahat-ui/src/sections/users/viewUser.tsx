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
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import ConfirmDialog from '../../components/dialog';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { MoreVertical, Trash2 } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import Image from 'next/image';
import { Dropdown } from 'react-day-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { useState } from 'react';

type IProps = {
  data: IUserItem;
};

export default function UserDetail({ data }: IProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details'
  );

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex justify-end py-3 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical
              className="cursor-pointer"
              size={20}
              strokeWidth={1.5}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleTabChange('details')}>
              Details{' '}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange('edit')}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <div className="flex flex-col">
              <div>
                <h1 className="font-semibold text-xl">{data.name}</h1>
              </div>
              <p className="text-slate-500">{data.email}</p>
            </div>
          </div>
          <Badge>Active</Badge>
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <div className="border-y flex items-center justify-between flex-wrap mx-4 py-4 gap-3">
          <div>
            <p className="font-light text-base">{data.name}</p>
            <p className="text-sm font-normal text-muted-foreground ">Name</p>
          </div>
          <div>
            <p className="font-light text-base">{'Male'}</p>
            <p className="text-sm font-normal text-muted-foreground ">Gender</p>
          </div>
          <div>
            <p className="font-light text-base">{data.email || 'N/A'}</p>
            <p className="text-sm font-normal text-muted-foreground ">Email</p>
          </div>
          <div>
            <p className="font-light text-base">{'986758465'}</p>
            <p className="text-sm font-normal text-muted-foreground ">Phone</p>
          </div>
          <div>
            <p className="font-light text-base">
              {data.walletaddress ||
                '0xAC6bFaf10e89202c293dD795eCe180BBf1430d7B'}
            </p>
            <p className="text-sm font-normal text-muted-foreground ">Wallet</p>
          </div>
        </div>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && (
        <>
          <div className="flex flex-col justify-between min-h-[40vh] overflow-y-auto  max-h-[80vh]">
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
        </>
      )}
    </>
  );
}
