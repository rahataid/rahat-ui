'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { ComponentType } from 'react'; // Import ComponentType

const AAProjectView = dynamic(
  () => import('../../../../sections/projects/aa/project-details.view'),
);
const CVAProjectView = dynamic(
  () => import('../../../../sections/projects/cva/project-details.view'),
);

const ELProjectView = dynamic(
  () => import('../../../../sections/projects/el/project-details.view'),
);

const pages: { [key: string]: ComponentType<any> } = {
  // Update the type of values in the pages object
  cva: CVAProjectView,
  aa: AAProjectView,
  el: ELProjectView,
};

const ProjectDetail = () => {
  const { projectType } = useParams();
  const Page = pages[projectType as string];

  return Page ? (
    <Page />
  ) : (
    <h1 className="text-red-500">The Project Type doesn&apos;t exist.</h1>
  );
};

export default ProjectDetail;
