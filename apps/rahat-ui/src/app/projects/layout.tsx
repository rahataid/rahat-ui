'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../sections/projects/components';
import DashboardLayout from '../dashboard/layout';
import AuthGuard from '../../guards/auth-guard';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const allowedPaths: string[] = [];
  const allowNavPaths = ['/projects'];
  // const allowedPaths = ['/projects', '/projects/add'];

  return (
    <AuthGuard>
      <DashboardLayout
        hasDefaultHeader={allowNavPaths.includes(pathName)}
        margin="mt-0"
      >
        <title>Projects</title>
        {!allowedPaths.includes(pathName) ? (
          <>{children}</>
        ) : (
          <ProjectLayout projectType="ALL">{children}</ProjectLayout>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
