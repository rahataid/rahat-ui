'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useNavItems } from '../../../../sections/projects/cva/useCVANavItems';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';

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
