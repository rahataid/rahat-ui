'use client';

import {
  useGetBeneficiaryStats,
  useGetProjectBeneficiaryStats,
  useProjectAction,
  useProjectBeneficiaries,
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
import { BarChart } from '@rahat-ui/shadcn/charts';

const ProjectMainView = () => {
  const { id } = useParams();
  const [projectStats, setProjectStats] = useState();
  const [ELProjectStats, setELProjectStats] = useState();

  const project = useProjectStore((state) => state.singleProject);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id] || null,
  );
  const beneficiaryStats = useGetProjectBeneficiaryStats();

  const { data: beneficiaryDetails, refetch: refetchBeneficiary } =
    useReadElProjectGetTotalBeneficiaries({
      address: contractSettings?.elproject?.address,
    });

  const { data: projectVoucher } = useReadElProjectGetProjectVoucherDetail({
    address: contractSettings?.elproject?.address,
  });

  const {
    data: voucherDetails,
    refetch: refetchVoucher,
    isLoading,
  } = useProjectVoucher(
    contractSettings?.elproject?.address,
    contractSettings?.eyevoucher?.address,
  );

  if (!contractSettings) {
    return 'Loading Project Settings';
  }

  const projectClient = useProjectAction();
  const statsClient = useProjectAction(['stats']);

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

  const getElProjectStats = useCallback(async () => {
    const result = await statsClient.mutateAsync({
      uuid: id,
      data: {
        action: 'elProject.getAllStats',
        payload: {},
      },
    });
    setELProjectStats(result?.data);
  }, [id]);

  useEffect(() => {
    getProjectStats();
    getElProjectStats();
  }, [getProjectStats, getElProjectStats]);

  const filteredChartData = beneficiaryStats.data?.data.filter((item) => {
    const name = item.name;
    return name === 'BENEFICIARY_AGE_RANGE';
  });

  const filterdELChartData = ELProjectStats?.filter((item) => {
    const name = item.name;
    return name === 'BENEFICIARY_TYPE';
  });

  return (
    <div className="p-2 bg-secondary">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <ProjectInfo
          project={project}
          totalBeneficiary={projectStats?.benTotal}
          totalVendor={projectStats?.vendorTotal}
        />
        <ProjectDataCard
          beneficiaryDetails={beneficiaryDetails}
          totalBeneficiary={projectStats?.benTotal}
          totalVendor={projectStats?.vendorTotal}
          projectVoucher={projectVoucher}
          voucherDetails={voucherDetails}
          refetchBeneficiary={refetchBeneficiary}
          refetchVoucher={refetchVoucher}
          loading={isLoading}
        />
        <ProjectChart
          chartData={[...filteredChartData, ...filterdELChartData]}
        />
        <BarChart series={[1, 2, 3, 4, 5, 6]} categories={['helllo']} />
      </ScrollArea>
    </div>
  );
};

export default memo(ProjectMainView);
