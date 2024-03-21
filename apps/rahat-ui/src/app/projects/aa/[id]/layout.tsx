'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useNavItems } from '../../../../sections/projects/aa/useAANavItems';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = useNavItems();
  return <ProjectLayout menuItems={menuItems}>{children}</ProjectLayout>;
}
