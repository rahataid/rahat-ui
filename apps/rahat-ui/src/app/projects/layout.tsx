'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
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
  const { id } = useParams();
  const router = useRouter();
  const [checking, setChecking] = React.useState(true);

  // UUID format validation (simple regex for UUID v4)
  const isValidUUID = (uuid: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      uuid,
    );

  React.useEffect(() => {
    if (id === undefined) {
      // still waiting for hydration → do nothing
      return;
    }

    if (!id || !isValidUUID(id as string)) {
      router.replace('/projects');
    } else {
      setChecking(false);
    }
  }, [id, router]);

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
