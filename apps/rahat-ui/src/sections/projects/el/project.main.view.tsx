'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useGetBeneficiaryStats,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  useReadElProjectGetProjectVoucherDetail,
  useReadElProjectGetTotalBeneficiaries,
} from 'apps/rahat-ui/src/hooks/el/contracts/elProject';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';
import { memo } from 'react';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';

const ProjectMainView = () => {
  const { id } = useParams();

  const project = useProjectStore((state) => state.singleProject);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  console.log(
    'state.settings?.[id][PROJECT_SETTINGS_KEYS.CONTRACT]',
    contractSettings,
  );
  const beneficiaryStats = useGetBeneficiaryStats();

  const { data: beneficiaryDetails, refetch: refetchBeneficiary } =
    useReadElProjectGetTotalBeneficiaries({
      address: contractSettings?.elproject?.address,
    });

  const { data: projectVoucher } = useReadElProjectGetProjectVoucherDetail({
    address: contractSettings?.elproject?.address,
  });

  const { data: voucherDetails, refetch: refetchVoucher } = useProjectVoucher(
    contractSettings?.elproject?.address,
    contractSettings?.eyevoucher?.address,
  );

  if (!contractSettings) {
    return 'Loading Project Settings';
  }

  return (
    <div className="p-2 bg-secondary">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <ProjectInfo project={project} />
        <ProjectDataCard
          beneficiaryDetails={beneficiaryDetails}
          projectVoucher={projectVoucher}
          voucherDetails={voucherDetails}
          refetchBeneficiary={refetchBeneficiary}
          refetchVoucher={refetchVoucher}
        />
        <ProjectChart chartData={beneficiaryStats.data?.data} />
      </ScrollArea>
    </div>
  );
};

export default memo(ProjectMainView);
