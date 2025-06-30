'use client';
import { useCommuicationStatsforBeneficiaryandStakeHolders } from '@rahat-ui/query';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

type ChannelType = 'EMAIL' | 'SMS' | 'IVR';

type CommunicationStats = {
  SUCCESS?: number;
  TOTAL?: number;
  FAIL?: number; // Optional, only present if there are failures
};

type RoleType = 'beneficiary' | 'stakeholder';

type CommunicationBeneficiaryStakeholdersReport = {
  [role in RoleType]: {
    [channel in ChannelType]?: CommunicationStats;
  };
};

type CommunicationsChartsStatsProps = {
  commsStatsData: any;
  statsBenefStakeholders?: CommunicationBeneficiaryStakeholdersReport;
};
export default function CommunicationsChartsStats({
  commsStatsData,
  statsBenefStakeholders,
}: CommunicationsChartsStatsProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {/* SMS Card */}
        <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total SMS Sent
            </CardTitle>
            <CardDescription className="text-lg text-sky-500 font-bold">
              {(statsBenefStakeholders?.beneficiary?.SMS?.TOTAL || 0) +
                (statsBenefStakeholders?.stakeholder?.SMS?.TOTAL || 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row  ">
            <div className=" flex justify-center items-center xl:items-start xl:justify-normal ">
              <PieChart
                chart={{
                  series: [
                    {
                      label: 'Successfully Delivered SMS',
                      value:
                        (statsBenefStakeholders?.beneficiary?.SMS?.SUCCESS ||
                          0) +
                        (statsBenefStakeholders?.stakeholder?.SMS?.SUCCESS ||
                          0),
                    },
                    {
                      label: 'SMS Delivery Failures',
                      value:
                        (statsBenefStakeholders?.beneficiary?.SMS?.FAIL || 0) +
                        (statsBenefStakeholders?.stakeholder?.SMS?.FAIL || 0),
                    },
                  ],
                  colors: ['#43A047', '#E53935'],
                }}
                custom={true}
                projectAA={true}
                width={380}
                height={300}
              />
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-1">
              {[
                {
                  label: 'Successfully Delivered',
                  value:
                    (statsBenefStakeholders?.beneficiary?.SMS?.SUCCESS || 0) +
                      (statsBenefStakeholders?.stakeholder?.SMS?.SUCCESS ||
                        0) || 0,
                },
                {
                  label: 'SMS Delivery Failures',
                  value:
                    (statsBenefStakeholders?.beneficiary?.SMS?.FAIL || 0) +
                      (statsBenefStakeholders?.stakeholder?.SMS?.FAIL || 0) ||
                    0,
                },
                {
                  label: 'SMS Successfully sent to Beneficiaries',
                  value: statsBenefStakeholders?.beneficiary?.SMS?.SUCCESS || 0,
                },
                {
                  label: 'SMS Successfully sent to Stakeholders',
                  value: statsBenefStakeholders?.stakeholder?.SMS?.SUCCESS || 0,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col flex-wrap bg-white">
                  <p className="text-sm text-gray-600 text-wrap">{label}</p>
                  <p className="text-lg font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* the comment part is for the email which may be used in future  */}
        {/* Email Card */}
        {/* <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total Email Sent
            </CardTitle>
            <CardDescription className="text-lg text-sky-500 font-bold">
              {
                commsStatsData?.stats?.transportStats.find(
                  (r) => r.name === 'EMAIL',
                )?.broadcasts?.total
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex  justify-between flex-col xl:flex-row">
            <div className="flex justify-center items-center xl:items-start xl:justify-normal">
              <PieChart
                chart={{
                  series: [
                    {
                      label: 'Successfully Delivered Email',
                      value:
                        commsStatsData?.stats?.transportStats.find(
                          (r) => r.name === 'EMAIL',
                        )?.broadcasts?.success || 0,
                    },
                    {
                      label: 'Email Delivery Failures',
                      value:
                        commsStatsData?.stats?.transportStats.find(
                          (r) => r.name === 'EMAIL',
                        )?.broadcasts?.failed || 0,
                    },
                  ],
                  colors: ['#F4A462', '#2A9D90'],
                }}
                custom={true}
                projectAA={true}
                width={380}
                height={300}
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1">
              {[
                {
                  label: 'Successfully Delivered',
                  value:
                    commsStatsData?.stats?.transportStats.find(
                      (r) => r.name === 'EMAIL',
                    )?.broadcasts?.success || 0,
                },
                {
                  label: 'Email Delivery Failures',
                  value:
                    commsStatsData?.stats?.transportStats.find(
                      (r) => r.name === 'EMAIL',
                    )?.broadcasts?.failed || 0,
                },
                {
                  label: 'Email Successfully sent to Beneficiaries',
                  value:
                    commsStatsData?.stats?.transportStats.find(
                      (r) => r.name === 'EMAIL',
                    )?.broadcasts?.total || 0,
                },
                {
                  label: 'Email Successfully sent to Stakeholders',
                  value:
                    commsStatsData?.stats?.transportStats.find(
                      (r: any) => r.name === 'EMAIL',
                    )?.broadcasts?.total || 0,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col bg-white">
                  <p className="text-sm text-gray-600 text-wrap">{label}</p>
                  <p className="text-lg font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

        {/* AVC Card */}
        {/* <div className="w-full"> */}
        <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total AVC Sent
            </CardTitle>
            <CardDescription className="text-lg text-sky-500 font-bold">
              {(statsBenefStakeholders?.beneficiary?.IVR?.TOTAL || 0) +
                (statsBenefStakeholders?.stakeholder?.IVR?.TOTAL || 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row  ">
            <div className=" flex justify-center items-center xl:items-start xl:justify-normal ">
              <PieChart
                chart={{
                  series: [
                    {
                      label: 'Successfully Delivered AVC',
                      value:
                        (statsBenefStakeholders?.beneficiary?.IVR?.SUCCESS ||
                          0) +
                          (statsBenefStakeholders?.stakeholder?.IVR?.SUCCESS ||
                            0) || 0,
                    },
                    {
                      label: 'AVC Delivery Failures',
                      value:
                        (statsBenefStakeholders?.beneficiary?.IVR?.FAIL || 0) +
                          (statsBenefStakeholders?.stakeholder?.IVR?.FAIL ||
                            0) || 0,
                    },
                  ],
                  colors: ['#43A047', '#E53935'],
                }}
                custom={true}
                projectAA={true}
                width={400}
                height={300}
              />
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 ">
              {[
                {
                  label: 'Unique AVC Recipients',
                  value:
                    commsStatsData?.stats?.transportStats.find(
                      (r) => r.name === 'IVR',
                    )?.totalRecipients || 0,
                },
                {
                  label: 'Successfully Delivered',
                  value:
                    (statsBenefStakeholders?.beneficiary?.IVR?.SUCCESS || 0) +
                      (statsBenefStakeholders?.stakeholder?.IVR?.SUCCESS ||
                        0) || 0,
                },

                {
                  label: 'AVC Delivery Failures',
                  value:
                    (statsBenefStakeholders?.beneficiary?.IVR?.FAIL || 0) +
                      (statsBenefStakeholders?.stakeholder?.IVR?.FAIL || 0) ||
                    0,
                },
                {
                  label: 'AVC Successfully sent to Beneficiaries',
                  value: statsBenefStakeholders?.beneficiary?.IVR?.SUCCESS || 0,
                },
                {
                  label: 'AVC Successfully sent to Stakeholders',
                  value: statsBenefStakeholders?.stakeholder?.IVR?.SUCCESS,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col flex-wrap bg-white">
                  <p className="text-sm text-gray-600 text-wrap">{label}</p>
                  <p className="text-lg font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
