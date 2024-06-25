'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../sections/projects/components';
import DashboardLayout from '../dashboard/layout';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const allowedPaths: string[] = [];
  const allowNavPaths = ['/projects'];
  // const allowedPaths = ['/projects', '/projects/add'];
  //
  return (
    <DashboardLayout hasDefaultHeader={allowNavPaths.includes(pathName)}>
      <title>Projects</title>
      {!allowedPaths.includes(pathName) ? (
        <>{children}</>
      ) : (
        <ProjectLayout projectType="ALL">{children}</ProjectLayout>
      )}
    </DashboardLayout>
  );
}
