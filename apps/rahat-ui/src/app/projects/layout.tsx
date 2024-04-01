'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../sections/projects/components';
import { useProjectListNavItems } from '../../sections/projects/useNavItems';
import DashboardLayout from '../dashboard/layout';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = useProjectListNavItems();
  const pathName = usePathname();
  const allowedPaths = ['/projects', '/projects/add'];
  return (
    <DashboardLayout>
      {!allowedPaths.includes(pathName) ? (
        <div className="mx-2">{children}</div>
      ) : (
        <ProjectLayout menuItems={menuItems}>
          <div className="mx-2">{children}</div>
        </ProjectLayout>
      )}
    </DashboardLayout>
  );
}
