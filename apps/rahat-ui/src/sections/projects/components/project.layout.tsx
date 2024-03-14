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
  children: React.ReactNode;
  menuItems: NavItem[];
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ children, menuItems }) => {
  return (
    <div>
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
            {menuItems.map((item) => (
              <ProjectNavView
                key={item.title}
                title={item.title}
                items={item.children}
              />
            ))}
            <Separator />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
};

export default ProjectLayout;
