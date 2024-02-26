'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import UserNav from '../../components/users/nav';
import UsersTable from '../../components/users/usersTable';
import UserDetails from '../../components/users/viewUser';
import { IUserItem } from '../../types/user';
import { useState } from 'react';
import AddUser from '../../components/users/addUser';

export default function UsersPage() {
  const [selectedData, setSelectedData] = useState<IUserItem>();
  const [addUser, setAddUser] = useState<boolean>(false);

  const handleUserClick = (item: IUserItem) => {
    setSelectedData(item);
    setAddUser(false);
  };

  const handleAddUser = () => {
    setAddUser(true);
    setSelectedData(undefined);
  };

  return (
    <div className="mt-2">
      <Tabs defaultValue="grid">
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
            <UserNav onAddUsersClick={handleAddUser} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <UsersTable handleClick={handleUserClick} />
          </ResizablePanel>
          {selectedData || addUser ? (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                {selectedData && <UserDetails data={selectedData} />}
                {addUser && <AddUser />}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
