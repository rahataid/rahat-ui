'use client';

import React, { FC } from 'react';
import { ProjectType } from './nav-items.types';
import { ProjectNav } from './project-header';
import { useProjectHeaderItems } from './useProjectHeaderItems';
import { useProjectNavItems } from './useProjectNavItems';
import { SidebarProvider } from '@rahat-ui/shadcn/src/components/ui/sidebar';
import { ProjectSidebar } from 'apps/rahat-ui/src/sidebar-components/project-sidebar';
import { useParams, useRouter } from 'next/navigation';

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
  const { id } = useParams();
  const router = useRouter();

  // UUID format validation (simple regex for UUID v4)
  const isValidUUID = (uuid: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      uuid,
    );
  React.useEffect(() => {
    if (!id || !isValidUUID(id)) {
      // Redirect to the project list page if UUID is missing or invalid
      router.push('/projects');
    }
  }, [id]);

  const { navItems: menuItems } = useProjectNavItems(projectType);
  const { headerNav } = useProjectHeaderItems(projectType);

  return (
    <>
      <SidebarProvider>
        {menuItems.map((item) => (
          <ProjectSidebar
            key={item.title}
            title={item.title}
            items={item.children}
          />
        ))}
        <div className="w-full h-full">
          <ProjectNav component={headerNav} />
          {children}
        </div>
      </SidebarProvider>
    </>
  );
};

export default ProjectLayout;
