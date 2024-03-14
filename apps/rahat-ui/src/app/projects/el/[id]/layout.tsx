'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useNavItems } from '../../../../sections/projects/el/useNavItems';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = useNavItems();
  return <ProjectLayout menuItems={navItems}>{children}</ProjectLayout>;
}
