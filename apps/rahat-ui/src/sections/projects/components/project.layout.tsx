'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
// import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
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
      <ResizablePanel minSize={40} key={index}>
        {children}
        {/* <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea> */}
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
    <>
      <ResizablePanelGroup
        direction="horizontal"
      >
        <ResizablePanel
          defaultSize={18}
          minSize={18}
          maxSize={18}
        >
          {menuItems.map((item) => (
            <ProjectNavView
              key={item.title}
              title={item.title}
              items={item.children}
            />
          ))}
        </ResizablePanel>
        {renderChildren()}
      </ResizablePanelGroup>
    </>
  );
};

export default ProjectLayout;
