'use client';

import {
  PROJECT_SETTINGS_KEYS,
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
import { useProjectVoucher, useAllVendorVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import { cn } from '@rahat-ui/shadcn/src';

const ProjectMainView = () => {
  const { id } = useParams();
  const [ELProjectStats, setELProjectStats] = useState();
  const statsClient = useProjectAction(['stats']);
  const project = useProjectStore((state) => state.singleProject);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const[vendorCount,setVendorCount] = useState(0)

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

  const {data:vendorDetails} = useAllVendorVoucher();  

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
    getElProjectStats();
  }, [getElProjectStats]);

  useEffect(()=>{
    if(!vendorDetails?.voucherArray) return;
    const count = Object.keys(vendorDetails?.voucherArray).length;
    setVendorCount(count);
  },[vendorDetails])

  const filterdELChartData =
    ELProjectStats?.filter((item) => {
      const name = item?.name;
      return name === 'BENEFICIARY_TYPE';
    }) || [];

  const referred = ELProjectStats?.filter((item) => {
    return item?.name === 'REFERRAL';
  })?.[0]?.data;

  const referredCounts = referred
    ? Object.values(referred).map((entry) => entry?.REFERRED)
    : [];

  const datesReferred = referred ? Object.keys(referred) : [];

  const freeVoucher = ELProjectStats?.filter((item) => {
    return item?.name === 'VOUCHERCLAIMS';
  })?.[0]?.data;

  const freeVoucherCounts = freeVoucher
    ? Object.values(freeVoucher).map((entry) => entry?.FREE_VOUCHER || null)
    : [];

  const refferedVoucher = ELProjectStats?.filter((item) => {
    return item?.name === 'VOUCHERCLAIMS';
  })?.[0]?.data;

  const referredVoucherCounts = refferedVoucher
    ? Object.values(refferedVoucher).map((entry) => {
        return entry?.DISCOUNT_VOUCHER || null;
      })
    : [];

  const seriesDataVouchers = [
    {
      name: 'Free Voucher',
      data: freeVoucherCounts,
    },
    {
      name: 'Discount Voucher',
      data: referredVoucherCounts,
    },
  ];

  const seriesDataReferred = [
    {
      name: 'Referred',
      data: referredCounts,
    },
  ];

  const dates = freeVoucher ? Object.keys(freeVoucher) : [];

  const footfallEyeCheckUp = ELProjectStats?.filter((item) => {
    return item?.name === 'FOOTFALL';
  })?.[0]?.data?.find((i) => i.id === 'EYE_CHECK_UP_DONE');

  const footfallEyeCheckUpNotDone = ELProjectStats?.filter((item) => {
    return item?.name === 'FOOTFALL';
  })?.[0]?.data?.find((i) => i.id === 'EYE_CHECK_UP_NOT_DONE');

  const enrolledEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_EYE_CHECK_UP_DONE');

  const enrolledNoGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_GLASS_NOT_REQUIRED');

  const enrolledReadingGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_READING_GLASS');

  const referredReadingGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_READING_GLASS');

  const referredNoGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_GLASS_NOT_REQUIRED');

  const referredRegularSunGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_REGULAR_SUNGLASS');

  const enrolledRegularSunGlass = ELProjectStats?.filter((item) => {
    return item.name === 'GLASS_STATUS';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_REGULAR_SUNGLASS');

  const referredEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_EYE_CHECK_UP_DONE');

  const enrolledNoEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'ENROLLED_EYE_CHECK_UP_NOT_DONE');

  const referredNoEyeCheckupData = ELProjectStats?.filter((item) => {
    return item.name === 'EYE_CHECKUP';
  })?.[0]?.data?.find((i) => i.id === 'REFERRED_EYE_CHECK_UP_NOT_DONE');

  const footfallFilteredData = [
    {
      name: 'FOOTFALL',
      group: 'footfall',
      data: [
        {
          id: 'Eye_Check_Up',
          count: footfallEyeCheckUp?.count || 0,
        },
        {
          id: 'No_Eye_Check_Up',
          count: footfallEyeCheckUpNotDone?.count || 0,
        },
      ],
    },
  ];

  const beneficiaryFilteredData =[
    {
      name:'BENEFICIARY_TYPE',
      grpup:'beneficiary_type',
      data:[
        {
          id:'Enrolled',
          count:Number(projectVoucher?.eyeVoucherAssigned) || 0
        },
        {
          id:'Referred',
          count:Number(projectVoucher?.referredVoucherAssigned) || 0
        }
      ]
    }
  ]

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
      name: 'Reading Glasses',
      data: [
        enrolledReadingGlass?.count || 0,
        referredReadingGlass?.count || 0,
      ],
    },
    {
      name: 'Glasses Not Required',
      data: [enrolledNoGlass?.count || 0, referredNoGlass?.count || 0],
    },
    {
      name: 'Regular Sunglasses',
      data: [
        enrolledRegularSunGlass?.count || 0,
        referredRegularSunGlass?.count || 0,
      ],
    },
  ];

  return (
    <div className="p-2 bg-secondary">
      <ScrollArea className="h-[calc(100vh-80px)]">
        <ProjectInfo
          project={project}
          totalVendor={vendorCount}
          loading={isLoading}
          refetchBeneficiary={refetchBeneficiary}
          beneficiaryDetails={beneficiaryDetails}
          projectVoucher={projectVoucher}
          voucherDetails={voucherDetails}
        />
        <ProjectDataCard
          totalVendor={vendorCount}
          refetchVoucher={refetchVoucher}
          loading={isLoading}
          ELProjectStats={ELProjectStats}
          projectVoucher={projectVoucher}
          voucherDetails={voucherDetails}
        />
        <div
          className={cn(
            `grid ${
              dates.length > 6 ? 'grid-cols-1' : 'grid-cols-2'
            } mt-2 mb-2 gap-2`,
          )}
        >
          <div className="bg-card h-96">
            <p>No. of Redemptions (per week)</p>
            <ChartLine series={seriesDataVouchers} categories={dates} />
          </div>
          <div className="bg-card h-96">
            <p>No. of Referrals (per week)</p>
            <ChartLine series={seriesDataReferred} categories={datesReferred} />
          </div>
        </div>
        <ProjectChart
          chartData={[...footfallFilteredData, ...beneficiaryFilteredData]}
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
