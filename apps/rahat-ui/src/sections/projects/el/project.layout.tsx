'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { FC } from 'react';
import ProjectNavView from './project.nav.view';
import { useNavItems } from './useNavItems';

type ProjectLayoutProps = {
  children: React.ReactNode;
};

const ProjectLayout: FC<ProjectLayoutProps> = ({ children }) => {
  const navItems = useNavItems();
  return (
    <div className="mb-5">
      <Tabs defaultValue="grid">
        <ResizablePanelGroup direction="horizontal" className="min-h-max">
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            {navItems.map((item) => (
              <ProjectNavView
                key={item.title}
                title={item.title}
                items={item.children}
              />
            ))}
            <Separator />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ScrollArea className="h-[calc(100vh-65px)]">{children}</ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
};

export default ProjectLayout;
