'use client';

import {
  useGetBeneficiaryStats,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import {
  useBeneficiaryCount,
  useProjectVoucher,
} from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';
import { memo } from 'react';

const ProjectMainView = () => {
  const { id } = useParams();

  const project = useProjectStore((state) => state.singleProject);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id] || null,
  );
  const beneficiaryStats = useGetBeneficiaryStats();
  console.log('beneficiaryState.data', beneficiaryStats.data);

  const { data: beneficiaryDetails } = useBeneficiaryCount(
    contractSettings?.elproject?.address || null,
  );

  const { data: projectVoucher } = useProjectVoucher(
    contractSettings?.elproject?.address,
    contractSettings?.eyevoucher?.address,
  );

  if (!contractSettings) {
    return 'Loading Project Settings';
  }

  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo project={project} />
      <ProjectDataCard
        beneficiaryDetails={beneficiaryDetails}
        projectVoucher={projectVoucher}
      />
      <ProjectChart chartData={beneficiaryStats.data?.data} />
    </div>
  );
};

export default memo(ProjectMainView);
