'use client';

import { AAProjectView } from 'apps/rahat-ui/src/sections/projects/aa';
import { CVAProjectView } from 'apps/rahat-ui/src/sections/projects/cva';
import { ELProjectView } from 'apps/rahat-ui/src/sections/projects/el';
import { useParams } from 'next/navigation';
import React from 'react';

const pages = {
  cva: <CVAProjectView />,
  aa: <AAProjectView />,
  el: <ELProjectView />,
};

const ProjectDetail = () => {
  const { projectType, id } = useParams();
  return pages[projectType];
};

export default ProjectDetail;
