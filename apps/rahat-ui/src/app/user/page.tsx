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

export default function UsersPage() {
  const [selectedData, setSelectedData] = useState<IUserItem>();

  const handleUserClick = (item: IUserItem) => {
    setSelectedData(item);
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
            <UserNav />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <UsersTable handleClick={handleUserClick} />
          </ResizablePanel>
          {selectedData && (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                <UserDetails data={selectedData} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
