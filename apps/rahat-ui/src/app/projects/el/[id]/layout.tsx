'use client';

import * as React from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useNavItems } from '../../../../sections/projects/el/useNavItems';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = useNavItems();
  const { secondPanel } = useSecondPanel();

  return (
    <ProjectLayout menuItems={navItems}>
      {secondPanel ? [children, secondPanel] : children}
    </ProjectLayout>
  );
}
