'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import { ProjectLayout } from '../../sections/projects/components';
import { useProjectListNavItems } from '../../sections/projects/useNavItems';
import { usePathname } from 'next/navigation';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = useProjectListNavItems();
  const pathName = usePathname();
  const allowedPaths = ['/projects', '/projects/add'];
  return (
    <>
      <Nav />
      {!allowedPaths.includes(pathName) ? (
        <div className="mx-2">{children}</div>
      ) : (
        <ProjectLayout menuItems={menuItems}>
          <div className="mx-2">{children}</div>
        </ProjectLayout>
      )}
    </>
  );
}
