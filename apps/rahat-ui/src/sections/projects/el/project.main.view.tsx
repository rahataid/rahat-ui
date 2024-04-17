'use client';

import {
  useGetBeneficiaryStats,
  useProjectAction,
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
import { memo, useCallback, useEffect, useState } from 'react';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';

const ProjectMainView = () => {
  const { id } = useParams();
  const [projectStats, setProjectStats] = useState();

  const project = useProjectStore((state) => state.singleProject);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id] || null,
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

  const projectClient = useProjectAction();

  const getProjectStats = useCallback(async () => {
    const result = await projectClient.mutateAsync({
      uuid: id,
      data: {
        action: 'elProject.count_ben_vendor',
        payload: {},
      },
    });
    setProjectStats(result.data);
  }, [id]);

  useEffect(() => {
    getProjectStats();
  }, [getProjectStats]);

  return (
    <div className="p-2 bg-secondary">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <ProjectInfo project={project} />
        <ProjectDataCard
          beneficiaryDetails={beneficiaryDetails}
          totalBeneficiary={projectStats?.benTotal}
          totalVendor={projectStats?.vendorTotal}
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
