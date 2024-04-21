'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { ProjectTypes } from '@rahataid/sdk/enums';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectLayout projectType={ProjectTypes.ANTICIPATORY_ACTION}>
      {' '}
      {children}
    </ProjectLayout>
  );
}
