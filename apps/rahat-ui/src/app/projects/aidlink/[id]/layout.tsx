'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };
  return (
    <ProjectLayout projectType={'AIDLINK'}>{renderChildren()}</ProjectLayout>
  );
}
