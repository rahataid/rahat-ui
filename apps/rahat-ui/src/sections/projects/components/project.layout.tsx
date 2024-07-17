'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { FC } from 'react';
import { ProjectType } from './nav-items.types';
import { ProjectNav } from './project-header';
import ProjectNavView from './project.nav.view';
import { useProjectHeaderItems } from './useProjectHeaderItems';
import { useProjectNavItems } from './useProjectNavItems';

type ProjectLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  projectType: ProjectType;
  navFooter?: React.ReactNode;
};

const ProjectLayout: FC<ProjectLayoutProps> = ({
  children,
  projectType,
  navFooter,
}) => {
  const { navItems: menuItems } = useProjectNavItems(projectType);
  const { headerNav } = useProjectHeaderItems(projectType);
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
        {/* <ResizableHandle /> */}
        {renderResizablePanel(children)}
      </>
    );
  };

  return (
    <>
      <ProjectNav component={headerNav} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={18} minSize={18} maxSize={18}>
          {menuItems.map((item) => (
            <ProjectNavView
              key={item.title}
              title={item.title}
              items={item.children}
            />
          ))}
          {navFooter}
        </ResizablePanel>
        {renderChildren()}
      </ResizablePanelGroup>
    </>
  );
};

export default ProjectLayout;
