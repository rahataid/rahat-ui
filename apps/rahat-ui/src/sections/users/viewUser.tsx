import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/components/button';
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
import { useRoleList, useSettingsStore } from '@rahat-ui/query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Select,
  SelectContent,
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
import { Gender } from '@rahataid/sdk/enums';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import {
  useUserAddRoles,
  useUserCurrentUser,
  useUserRemove,
} from '@rumsan/react-query';
import { User } from '@rumsan/sdk/types';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { Archive, Minus, MoreVertical, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  useAddAdminRole,
  useAddManagerRole,
} from '../../hooks/el/contracts/el-contracts';
import EditUser from './editUser';
import { ROLE_TYPE } from './role/const';
import { UsersRoleTable } from './usersRoleTable';

type IProps = {
  userDetail: User;
  closeSecondPanel: VoidFunction;
};

export default function UserDetail({ userDetail, closeSecondPanel }: IProps) {
  const t = useTranslations('USERS_DETAIL');
  const ts = useTranslations('USERS_SPLIT_VIEW');
  const tg = useTranslations('GLOBAL');
  const { data } = useUserCurrentUser();
  const removeUser = useUserRemove();
  const { data: roleData } = useRoleList(); //TODO:fetch from store
  const addUserRole = useUserAddRoles();
  const addManagerRole = useAddManagerRole();
  const addAdminRole = useAddAdminRole();

  const accessContract = useSettingsStore((state) => state.accessManager);

  const isAdmin = data?.data?.roles.includes(ROLE_TYPE.ADMIN);
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [activeUser, setActiveUser] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const genderList = enumToObjectArray(Gender);
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };
  const toggleActiveUser = () => {
    setActiveUser(!activeUser);
  };

  const handleDeleteUser = () => {
    // if (userDetail.roles?.some((role) => role.))
    removeUser.mutateAsync(userDetail.uuid as UUID);
    closeSecondPanel();
  };

  const handleRoleAssign = () => {
    if (selectedRole === 'Manager') {
      addManagerRole.mutateAsync({
        data: {
          role: selectedRole,
          uuid: userDetail.uuid as UUID,
          wallet: userDetail.wallet,
        },
        contractAddress: accessContract,
      });
    } else if (selectedRole === 'Admin') {
      addAdminRole.mutateAsync({
        data: {
          role: selectedRole,
          uuid: userDetail.uuid as UUID,
          wallet: userDetail.wallet,
        },
        contractAddress: accessContract,
      });
    } else
      addUserRole.mutateAsync({
        uuid: userDetail.uuid as UUID,
        roles: [selectedRole],
      });
  };

  return (
    <>
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
        {/* Minimize  */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">{tg('CLOSE')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-3">
          {/* Add Roles */}
          {isAdmin && (
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
                      <p>{tg('ADD_ROLE')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{tg('ADD_ROLE')}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Select onValueChange={(value) => setSelectedRole(value)}>
                      <SelectTrigger className="max-w-32">
                        <SelectValue placeholder={t('ROLE')} />
                      </SelectTrigger>
                      <SelectContent>
                        {roleData &&
                          roleData?.data?.map((role: any) => {
                            return (
                              <SelectItem key={role.id} value={role.name || ''}>
                                {role.name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                </DialogDescription>
                <DialogFooter>
                  <div className="flex items-center justify-center mt-2 gap-4">
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleRoleAssign()}
                        variant="outline"
                      >
                        {tg('SUBMIT')}
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="outline">{tg('CANCEL')}</Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {/* Delete User */}
          {isAdmin && (
            <Dialog>
              <DialogTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Archive
                        className="cursor-pointer"
                        size={18}
                        strokeWidth={1.6}
                        color="#FF0000"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ts('ARCHIVE_USER')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{tg('ARE_YOU_SURE')}</DialogTitle>
                  <DialogDescription>
                    {ts('CONFIRM_IF_YOU_WANT_TO_ARCHIVE')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="flex items-center justify-center mt-2 gap-4">
                    <Button onClick={handleDeleteUser} variant="outline">
                      {tg('YES')}
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">{tg('NO')}</Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {/* Actions */}
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
                {tg('DETAILS')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                {tg('EDIT')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="cat"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl mb-1">{userDetail.name}</h1>
            <p className="text-slate-500">
              {userDetail.email
                ? userDetail.email
                : truncateEthAddress(userDetail.wallet || '-')}
            </p>
          </div>
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <Tabs defaultValue="details">
          <div className="p-2">
            <TabsList className="w-full grid grid-cols-2 border h-auto">
              <TabsTrigger value="details">{tg('DETAILS')}</TabsTrigger>
              <TabsTrigger value="roles">{ts('ROLES')}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="details">
            <Card className="shadow rounded m-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-light text-base">{userDetail.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {tg('NAME')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-light text-base">
                      {userDetail.gender || '-'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground ">
                      {tg('GENDER')}
                    </p>
                  </div>
                  <div>
                    <p className="font-light text-base">
                      {userDetail.email || '-'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground ">
                      {tg('EMAIL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-light text-base">
                      {userDetail.phone || '-'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground ">
                      {tg('PHONE')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="roles">
            <div className="px-2">
              <UsersRoleTable
                uuid={userDetail.uuid as UUID}
                isAdmin={isAdmin}
              />
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
      )}
      {/* Edit View */}
      {activeTab === 'edit' && (
        <>
          {/* <div className="flex flex-col justify-between ">
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
                  <Input className="mt-3" type="wallet" placeholder="WALLET" />
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
          </div> */}
          <EditUser userDetail={userDetail} />
        </>
      )}
    </>
  );
}
