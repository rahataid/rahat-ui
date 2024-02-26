'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import { Nav } from '../../components/users/nav';
import UsersTable from '../../components/users/usersTable';
import UserDetails from '../../components/users/viewUser';
import RoleDetails from '../../components/users/role/roleDetail';
import { IRoleItem, IUserItem } from '../../types/user';
import { useState } from 'react';
import { USER_NAV_ROUTE } from '../../const/user.const';
import RoleTable from '../../components/users/role/roleTable';
import AddRole from '../../components/users/role/addRole';

export default function UsersPage() {
  const [selectedUserData, setSelectedUserData] = useState<IUserItem>();
  const [selectedRoleData, setSelectedRoleData] = useState<IRoleItem>();

  const [activeTab, setActiveTab] = useState<string>(USER_NAV_ROUTE.DEFAULT);
  const handleUserClick = (item: IUserItem) => {
    setSelectedUserData(item);
  };

  const handleRoleClick = (item: IRoleItem) => {
    setSelectedRoleData(item);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="mb-5">
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between my-4">
          <h1 className="text-3xl font-semibold">Users List</h1>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            <Nav onTabChange={handleTabChange} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div className="p-2">
              {activeTab === USER_NAV_ROUTE.DEFAULT && (
                <UsersTable handleClick={handleUserClick} />
              )}
              {activeTab === USER_NAV_ROUTE.LIST_ROLE && (
                <RoleTable handleClick={handleRoleClick} />
              )}

              {activeTab === USER_NAV_ROUTE.ADD_ROLE && <AddRole />}
            </div>
          </ResizablePanel>
          {selectedUserData && (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                <UserDetails data={selectedUserData} />
              </ResizablePanel>
            </>
          )}
          {selectedRoleData && (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                <RoleDetails data={selectedRoleData} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
