'use client';

import {
  useProjectContractSettings,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const uuid = useParams().id as UUID;
  useProjectSubgraphSettings(uuid);
  useProjectContractSettings(uuid);

  return <ProjectLayout projectType={'el-crm'}>{children}</ProjectLayout>;
}
