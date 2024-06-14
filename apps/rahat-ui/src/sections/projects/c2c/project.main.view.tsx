'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { useBalance } from 'wagmi';
import ProjectInfo from './project.info';
import { useParams } from 'next/navigation';
import ProjectCharts from './project.charts';

const ProjectView = () => {
  const project = useProjectStore((state) => state.singleProject);
  const { id } = useParams();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const balance = useBalance({
    address: contractSettings?.c2cproject.address,
  });
  console.log('balance', balance.data);

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
        <ProjectCharts />
      </ScrollArea>
    </div>
  );
};

export default ProjectView;
