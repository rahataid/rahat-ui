import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { User } from '@rumsan/sdk/types';
import { MoreVertical, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { UsersRoleTable } from './usersRoleTable';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import { Gender } from '@rahataid/sdk/enums';

type IProps = {
  data: User;
};

export default function UserDetail({ data }: IProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details'
  );
  const [activeUser, setActiveUser] = useState<boolean>(true);
  const genderList = enumToObjectArray(Gender);
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };
  const toggleActiveUser = () => {
    setActiveUser(!activeUser);
  };
  console.log('genderList', genderList);
  return (
    <>
      <div className="p-4">
        <div className="flex">
          <Image
            className="rounded-full"
            src="/svg/funny-cat.svg"
            alt="cat"
            height={80}
            width={80}
          />
          <div className="flex flex-col items-center justify-center w-full mr-2 gap-2">
            <div className="flex align-center justify-between w-full ml-4">
              <h1 className="font-semibold text-xl">{data.name}</h1>
              <div className="flex">
                <div className="mr-3">
                  {/* Add Roles */}
                  <Dialog>
                    <DialogTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PlusCircle
                              className="cursor-pointer"
                              size={18}
                              strokeWidth={1.6}
                              color="#007bb6"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Role</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Role</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Input type="role" id="role" placeholder="Role" />
                        </div>
                      </DialogDescription>
                      <DialogFooter>
                        <div className="flex items-center justify-center mt-2 gap-4">
                          <Button variant="outline">Submit</Button>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  {/* Delete User */}
                  <Dialog>
                    <DialogTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash2
                              className="cursor-pointer"
                              size={18}
                              strokeWidth={1.6}
                              color="#FF0000"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your user.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="flex items-center justify-center mt-2 gap-4">
                          <Button variant="outline">Yes</Button>
                          <DialogClose asChild>
                            <Button variant="outline">No</Button>
                          </DialogClose>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="pl-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical
                        className="cursor-pointer"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleTabChange('details')}
                      >
                        Details{' '}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="flex align-center justify-between w-full ml-4">
              <p className="text-slate-500">
                {data.email
                  ? data.email
                  : truncateEthAddress(data.wallet || '-')}
              </p>
              <div className="flex items-center space-x-2">
                <Label
                  className="text-slate-500 font-light text-sm"
                  htmlFor="activeUser"
                >
                  {activeUser ? 'Active' : 'Inactive'}
                </Label>
                <Switch
                  className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-600"
                  id="activeUser"
                  checked={activeUser}
                  onCheckedChange={toggleActiveUser}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Details View */}

      {activeTab === 'details' && (
        <>
          <div className="w-full">
            <div className="border-t">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full border-b grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="roles">Roles</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    <div>
                      <p className="font-light text-base">{data.name}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        Name
                      </p>
                    </div>
                    <div>
                      <p className="font-light text-base">
                        {data.gender || '-'}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground ">
                        Gender
                      </p>
                    </div>
                  </div>
                  <div className="border-b grid grid-cols-2 gap-4 p-8">
                    <div>
                      <p className="font-light text-base">
                        {data.email || '-'}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground ">
                        Email
                      </p>
                    </div>
                    <div>
                      <p className="font-light text-base">
                        {data.phone || '-'}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground ">
                        Phone
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="roles">
                  <div className="p-8">
                    <UsersRoleTable />
                    {/* <Card className="p-4">
                      <div className="grid grid-cols-4">
                        <div className="grid grid-cols-subgrid gap-4 col-span-4">
                          <div className="flex items-center justify-between rounded-md border px-4 py-3 font-mono text-sm">
                            Admin
                            <Trash2
                              className="cursor-pointer"
                              size={18}
                              strokeWidth={1.6}
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-md border px-4 py-3 font-mono text-sm">
                            User
                            <Trash2
                              className="cursor-pointer"
                              size={18}
                              strokeWidth={1.6}
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-md border px-4 py-3 font-mono text-sm">
                            Manager
                            <Trash2
                              className="cursor-pointer"
                              size={18}
                              strokeWidth={1.6}
                            />
                          </div>
                        </div>
                      </div>
                    </Card> */}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && (
        <>
          <div className="flex flex-col justify-between ">
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <Input type="name" placeholder="Name" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {genderList.map((gender) => (
                        <SelectItem value={gender.value}>
                          {gender.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 mb-2">
                <p className="text-slate-700">Auth & Comms</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid grid-cols-subgrid col-span-2">
                  <Input type="email" placeholder="Email" />
                </div>
                <div className="grid grid-cols-subgrid col-span-1">
                  <Button
                    variant={'outline'}
                    className="border-primary text-primary"
                  >
                    Update
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid grid-cols-subgrid col-span-2">
                  <Input className="mt-3" type="wallet" placeholder="Wallet" />
                </div>
                <div className="grid grid-cols-subgrid col-span-1 mt-3">
                  <Button
                    variant={'outline'}
                    className="border-primary text-primary"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
