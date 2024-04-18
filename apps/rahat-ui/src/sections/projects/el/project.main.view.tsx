'use client';

import {
  useGetProjectBeneficiaryStats,
  useProjectAction,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { BarChart, ChartColumnStacked } from '@rahat-ui/shadcn/charts';
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

  const filteredChartData = beneficiaryStats?.data?.data
    ? beneficiaryStats.data.data.filter((item) => {
        const name = item?.name;
        return name === 'BENEFICIARY_AGE_RANGE';
      })
    : [];

  const filterdELChartData =
    ELProjectStats?.filter((item) => {
      const name = item?.name;
      return name === 'BENEFICIARY_TYPE' || name === 'FOOTFALL';
    }) || [];

  const seriesData = [
    {
      name: 'Enrolled',
      data: [10, 20, 30, 40, 50, 60],
    },
    {
      name: 'Referred',
      data: [15, 25, 35, 45, 55, 65],
    },
  ];

  console.log('ELProjectStats', ELProjectStats);
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
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-card rounded">
            <ChartColumnStacked series={seriesData} />

            <p className="mt-2 mb-1 ml-4">Eye Checkup Reporting</p>
          </div>
          <div className="bg-card rounded">
            <ChartColumnStacked series={seriesData} />

            <p className="mt-2 mb-1 ml-4">Glasses Required</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default memo(ProjectMainView);
