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
import ProjectNavView from './project.nav.view';

type ProjectLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems: NavItem[];
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ children, menuItems }) => {
  const renderResizablePanel = (children: React.ReactNode, index?: number) => {
    return (
      <ResizablePanel defaultSize={10} minSize={25} key={index}>
        <ScrollArea className="h-[calc(100vh-66px)] bg-secondary">
          {children}
        </ScrollArea>
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
            defaultSize={18}
            minSize={18}
            maxSize={18}
            className="h-full"
          >
            {menuItems.map((item) => (
              <ProjectNavView
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

export default ProjectLayout;
