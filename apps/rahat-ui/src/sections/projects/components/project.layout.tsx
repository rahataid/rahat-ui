'use client';

import { FC } from 'react';
import { ProjectType } from './nav-items.types';
import { ProjectNav } from './project-header';
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

  return (
    <>
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
          <ProjectNav component={headerNav} isClosed={isClosed} />
          {isClosed && (
            <Alert className="sticky top-14 z-10 rounded-none border-x-0 border-t-0 bg-red-50 border-red-300 text-red-800 py-3 px-4">
              <ShieldAlert className="h-6 w-6 !text-red-600" />
              <AlertTitle className="text-red-700 text-base">Project Closed</AlertTitle>
              <AlertDescription className="text-red-600 text-sm">
                This project has been closed and is now in read-only mode. You can view the project data, but you cannot create, update, or delete any records              </AlertDescription>
            </Alert>
          )}
          <div className="min-w-0">{children}</div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default ProjectLayout;
