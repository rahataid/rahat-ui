'use client';

import { UUID } from 'crypto';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import {
  Trash2,
  Copy,
  CopyCheck,
  X,
  Pencil,
  FolderPlus,
  Expand,
  FolderDot,
  Wallet,
  Phone,
  Mail,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import TooltipComponent from '../../components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useRoleList, useSettingsStore } from '@rahat-ui/query';
import { Gender } from '@rahataid/sdk/enums';
import {
  useUserAddRoles,
  useUserCurrentUser,
  useUserRemove,
} from '@rumsan/react-query';
import { User } from '@rumsan/sdk/types';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import {
  useAddAdminRole,
  useAddManagerRole,
} from '../../hooks/el/contracts/el-contracts';
import EditUser from './editUser';
import { ROLE_TYPE } from './role/const';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import React from 'react';
import AddButton from '../projects/components/add.btn';
import UsersRolesTabSplitView from './users.roles.tab.split.view';

type IProps = {
  userDetail: User;
  closeSecondPanel: VoidFunction;
};

export default function UsersDetailSplitView({
  userDetail,
  closeSecondPanel,
}: IProps) {
  console.log({ userDetail });
  const router = useRouter();
  const { data } = useUserCurrentUser();
  const removeUser = useUserRemove();
  const { data: roleData } = useRoleList(); //TODO:fetch from store
  const addUserRole = useUserAddRoles();
  const addManagerRole = useAddManagerRole();
  const addAdminRole = useAddAdminRole();

  const accessContract = useSettingsStore((state) => state.accessManager);

  const isAdmin = data?.data?.roles.includes(ROLE_TYPE.ADMIN);
  const [activeTab, setActiveTab] = React.useState<'details' | 'edit' | null>(
    'details',
  );
  const [activeUser, setActiveUser] = React.useState<boolean>(true);
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<boolean>(false);

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

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(true);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <TooltipComponent
            handleOnClick={() => {}}
            Icon={Trash2}
            tip="Delete"
            iconStyle="text-red-600"
          />
          <TooltipComponent
            handleOnClick={() => {
              router.push(`/users/${userDetail?.uuid}/edit`);
            }}
            Icon={Pencil}
            tip="Edit"
          />
          <TooltipComponent handleOnClick={() => {}} Icon={FolderPlus} tip="" />
          <TooltipComponent
            handleOnClick={() => router.push(`/users/${userDetail?.uuid}`)}
            Icon={Expand}
            tip="Expand"
          />
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip="Close"
        />
      </div>
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="profile"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl mb-1">{userDetail?.name}</h1>
            <div className="flex space-x-4 items-center">
              <Badge>{userDetail?.extras?.status ?? 'status'}</Badge>
              <p className="text-base text-muted-foreground">
                {userDetail?.gender ?? 'gender'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="general">
        <div className="flex justify-between items-center p-4">
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              id="general"
              className="w-full data-[state=active]:bg-white"
              value="general"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              id="usersRoles"
              className="w-full data-[state=active]:bg-white"
              value="usersRoles"
            >
              Users Roles
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="general">
          <div className="p-4 flex flex-col space-y-4">
            <h1 className="font-medium">General Details</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Wallet size={20} strokeWidth={1.5} />
                <p>Wallet Address</p>
              </div>
              <div
                className="flex space-x-3 items-center"
                onClick={() => clickToCopy(userDetail?.wallet as string)}
              >
                <p className="text-muted-foreground text-base">
                  {truncateEthAddress(userDetail?.wallet as string) ?? '-'}
                </p>
                {userDetail?.wallet &&
                  (walletAddressCopied ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-muted-foreground"
                      size={15}
                      strokeWidth={1.5}
                    />
                  ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Phone size={20} strokeWidth={1.5} />
                <p>Phone Number</p>
              </div>
              <p className="text-muted-foreground text-base">
                {userDetail?.phone || '-'}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Mail size={20} strokeWidth={1.5} />
                <p>Email Address</p>
              </div>
              <p className="text-muted-foreground text-base">
                {userDetail?.email || '-'}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="usersRoles">
          <UsersRolesTabSplitView userDetail={userDetail} />
        </TabsContent>
      </Tabs>
    </>
  );
}
