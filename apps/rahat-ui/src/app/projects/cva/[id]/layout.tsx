'use client';

import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  return (
    <ProjectLayout projectType={ProjectTypes.CVA}>
      {secondPanel ? [children, secondPanel] : children}
    </ProjectLayout>
  );
}
