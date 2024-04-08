'use client';

import { Separator } from '@rahat-ui/shadcn/components/separator';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { FC } from 'react';
import { NavItem } from './nav-items.types';
import UserNavView from './user.nav.view';

type UserLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems: NavItem[];
};

const UserLayout: FC<UserLayoutProps> = ({ children, menuItems }) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return (
      <ResizablePanel key={index}>
        <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea>
      </ResizablePanel>
    );
  };
  const renderChildren = () => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        return (
          <>
            <ResizableHandle withHandle />
            {renderResizablePanel(child, index)}
          </>
        );
      });
    }
    return (
      <>
        <ResizableHandle />
        {renderResizablePanel(children)}
      </>
    );
  };

  return (
    <div>
      <Tabs defaultValue="grid">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={20}
            maxSize={20}
            className="h-full"
          >
            {menuItems.map((item) => (
              <UserNavView
                key={item.title}
                title={item.title}
                items={item.children}
              />
            ))}
            <Separator />
          </ResizablePanel>
          {renderChildren()}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
};

export default UserLayout;
