'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../sections/projects/components';
import DashboardLayout from '../dashboard/layout';
import { SidebarProvider } from '@rahat-ui/shadcn/src/components/ui/sidebar';

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
  return (
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
  );
}
