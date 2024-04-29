'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useProjectAction, useProjectStore } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import ProjectInfo from './project.info';
import { useCall } from 'wagmi';

const ProjectView = () => {
  const { id } = useParams();
  const [projectStats, setProjectStats] = useState();
  const projectClient = useProjectAction(['count_beneficiary']);
  const statsClient = useProjectAction(['stats']);

  const project = useProjectStore((state) => state.singleProject);
  console.log({ project });

  // const getProjectStats = useCallback(async () => {
  //   const result = await projectClient.mutateAsync({
  //     uuid: id,
  //     data: {``

  //     }
  //   }_);
  // }, [id]);

  return (
    <div className="p-2 bg-secondary">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <ProjectInfo project={project} />
      </ScrollArea>
    </div>
  );
};

export default ProjectView;
