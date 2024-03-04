import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { User } from '@rumsan/sdk/types';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type IProps = {
  data: User;
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
      <div className="flex justify-end p-3 border-b">
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
            <div className="flex flex-col ml-4">
              <div>
                <h1 className="font-semibold text-xl">{data.name}</h1>
              </div>
              <p className="text-slate-500">
                {truncateEthAddress(data.wallet)}
              </p>
            </div>
          </div>
          <Badge>Active</Badge>
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <>
          <div className="border-t grid grid-cols-2 gap-4 p-8">
            <div>
              <p className="font-light text-base">{data.name}</p>
              <p className="text-sm font-normal text-muted-foreground ">Name</p>
            </div>
            <div>
              <p className="font-light text-base">{data.gender || '-'}</p>
              <p className="text-sm font-normal text-muted-foreground ">
                Gender
              </p>
            </div>
          </div>
          <div className="flex grid grid-cols-2 gap-4  p-8">
            <div>
              <p className="font-light text-base">{data.email || '-'}</p>
              <p className="text-sm font-normal text-muted-foreground ">
                Email
              </p>
            </div>
            <div>
              <p className="font-light text-base">{data.phone || '-'}</p>
              <p className="text-sm font-normal text-muted-foreground ">
                Phone
              </p>
            </div>
          </div>
        </>
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
