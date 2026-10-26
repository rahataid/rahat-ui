'use client';

import { useProjectStore } from '@rahat-ui/query';
import { Project } from '@rahataid/sdk/project/project.types';

type CvaProjectGuardProps = {
  children: React.ReactNode;
};

export default function CvaProjectGuard({ children }: CvaProjectGuardProps) {
  const project = useProjectStore((state) => state.singleProject) as Project;

  if (project?.type !== 'cva') return null;

  return <>{children}</>;
}
