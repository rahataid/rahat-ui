'use client';

import { UUID } from 'crypto';
import * as React from 'react';
import { useParams } from 'next/navigation';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { ProjectLayout } from '../../../../sections/projects/components';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();
  const uuid = useParams().id as UUID;

  return (
      <ProjectLayout projectType={ProjectTypes.COMMS}>
        {secondPanel ? [children, secondPanel] : children}
      </ProjectLayout>
  );
}
