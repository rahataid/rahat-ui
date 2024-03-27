'use client';

import { useProjectSettingsStore } from '@rahat-ui/query';
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
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id] || null,
  );

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
      <ProjectInfo />
      <ProjectDataCard
        beneficiaryDetails={beneficiaryDetails}
        projectVoucher={projectVoucher}
      />
      <ProjectChart />
    </div>
  );
};

export default memo(ProjectMainView);
