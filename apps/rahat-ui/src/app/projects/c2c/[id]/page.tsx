'use client';

import { useProject } from '@rahat-ui/query';
import { ProjectViewC2C } from 'apps/rahat-ui/src/sections/projects/c2c';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <ProjectViewC2C />;
};

export default Page;
