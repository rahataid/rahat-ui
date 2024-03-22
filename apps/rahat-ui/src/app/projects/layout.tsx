'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import { ProjectLayout } from '../../sections/projects/components';
import { useProjectListNavItems } from '../../sections/projects/useNavItems';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = useProjectListNavItems();
  return (
    <>
      <Nav />

      <ProjectLayout menuItems={menuItems}>
        <div className="mx-2">{children}</div>
      </ProjectLayout>
    </>
  );
}
