'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useGetBeneficiaryStats,
  useGetProjectBeneficiaryStats,
  useProjectAction,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';

import { ChartColumnStacked } from '@rahat-ui/shadcn/src/components/charts';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  useReadElProjectGetProjectVoucherDetail,
  useReadElProjectGetTotalBeneficiaries,
} from 'apps/rahat-ui/src/hooks/el/contracts/elProject';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';

const ProjectMainView = () => {
  const { id } = useParams();
  const [projectStats, setProjectStats] = useState();
  const [ELProjectStats, setELProjectStats] = useState();
  const projectClient = useProjectAction(['count_ben_vendor']);
  const statsClient = useProjectAction(['stats']);

  const stats = useGetProjectBeneficiaryStats(id);
  const project = useProjectStore((state) => state.singleProject);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

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

  const filterdELChartData =
    ELProjectStats?.filter((item) => {
      const name = item?.name;
      return name === 'BENEFICIARY_TYPE';
    }) || [];

  const filteredFootfallData =
    ELProjectStats?.filter((item) => {
      const name = item?.name;
      return name === 'FOOTFALL';
    }) || [];

  const enrolledEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_EYE_CHECKUP');

  const enrolledNoGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_no_glass');

  const enrolledGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_require_glass');

  const referredGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_require_glass');

  const referredNoGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_no_glass');

  const referredEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_EYE_CHECKUP');

  const enrolledNoEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_NO_EYE_CHECKUP');

  const referredNoEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_NO_EYE_CHECKUP');

  const eyeCheckupData = [
    {
      name: 'Eye Checkup',
      data: [
        enrolledEyeCheckupData?.count || 0,
        referredEyeCheckupData?.count || 0,
      ],
    },
    {
      name: 'No Eye Checkup',
      data: [
        enrolledNoEyeCheckupData?.count || 0,
        referredNoEyeCheckupData?.count || 0,
      ],
    },
  ];
  const glassData = [
    {
      name: 'Glass Required',
      data: [enrolledGlass?.count || 0, referredGlass?.count || 0],
    },
    {
      name: 'Glass Not Required',
      data: [enrolledNoGlass?.count || 0, referredNoGlass?.count || 0],
    },
  ];

  return (
    <div className="p-2 bg-secondary">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <ProjectInfo
          project={project}
          totalBeneficiary={projectStats?.benTotal}
          totalVendor={projectStats?.vendorTotal}
          loading={isLoading}
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
          ELProjectStats={ELProjectStats}
        />
        <ProjectChart
          chartData={[...filteredFootfallData, ...filterdELChartData]}
        />
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
          <div className="bg-card rounded">
            <p className="mt-2 mb-1 ml-4">Eye Checkup Reporting</p>
            <ChartColumnStacked series={eyeCheckupData} />
          </div>
          <div className="bg-card rounded">
            <p className="mt-2 mb-1 ml-4">Glasses Required</p>
            <ChartColumnStacked series={glassData} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default ProjectMainView;
