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
import { SidebarProvider } from '@rahat-ui/shadcn/src/components/ui/sidebar';
import { ProjectSidebar } from 'apps/rahat-ui/src/sidebar-components/project-sidebar';

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

  // --- Previous Project Layout---
  // const renderResizablePanel = (children: React.ReactNode, index?: number) => {
  //   return (
  //     <ResizablePanel minSize={40} key={index}>
  //       {children}
  //       {/* <ScrollArea className="h-[calc(100vh-66px)]">{children}</ScrollArea> */}
  //     </ResizablePanel>
  //   );
  // };
  // const renderChildren = () => {
  //   if (Array.isArray(children)) {
  //     return children.map((child, index) => {
  //       return (
  //         <>
  //           <ResizableHandle withHandle />
  //           {renderResizablePanel(child, index)}
  //         </>
  //       );
  //     });
  //   }
  //   return (
  //     <>
  //       {/* <ResizableHandle /> */}
  //       {renderResizablePanel(children)}
  //     </>
  //   );
  // };

  return (
    <>
      {/* 
      <ProjectNav component={headerNav} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15} minSize={15} maxSize={15}>
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
      */}

      <SidebarProvider>
        {menuItems.map((item) => (
          <ProjectSidebar
            key={item.title}
            title={item.title}
            isLoading={item.isLoading}
            items={item.children}
          />
        ))}
        <div className="w-full">
          <ProjectNav component={headerNav} />
          {children}
        </div>
      </SidebarProvider>
    </>
  );
};

export default ProjectLayout;
