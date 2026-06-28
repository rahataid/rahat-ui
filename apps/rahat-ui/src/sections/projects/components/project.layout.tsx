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
import { useProjectStore } from '@rahat-ui/query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

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
  const singleProject = useProjectStore((s) => s.singleProject);
  const isClosed = singleProject?.status === 'CLOSED';

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
        <div className="w-full min-w-0">
          <ProjectNav component={headerNav} />
          {isClosed && (
            <Alert className="sticky top-14 z-10 rounded-none border-x-0 border-t-0 bg-red-50 border-red-300 text-red-800 py-2 px-4">
              <ShieldAlert className="h-4 w-4 !text-red-600" />
              <AlertTitle className="text-red-700">Project Closed</AlertTitle>
              <AlertDescription className="text-red-600">
                This project has been closed. You can view the data but cannot perform any create, update, or delete operations.
              </AlertDescription>
            </Alert>
          )}
          <div className="min-w-0">{children}</div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default ProjectLayout;
