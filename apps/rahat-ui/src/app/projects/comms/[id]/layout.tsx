'use client';

import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';

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
