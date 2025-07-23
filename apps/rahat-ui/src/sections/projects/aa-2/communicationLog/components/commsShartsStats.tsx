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

type ChannelType = 'EMAIL' | 'SMS' | 'VOICE';

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
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
            <div className="flex justify-center xl:justify-start w-full">
              <div className="w-full max-w-[350px] aspect-square">
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
                          (statsBenefStakeholders?.beneficiary?.SMS?.FAIL ||
                            0) +
                          (statsBenefStakeholders?.stakeholder?.SMS?.FAIL || 0),
                      },
                    ],
                    colors: ['#43A047', '#E53935'],
                  }}
                  custom={true}
                  projectAA={true}
                  width={'100%'}
                  height={'100%'}
                  donutSize="80%"
                  type="donut"
                />
              </div>
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

        {/* Voice */}

        <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              Total AVC Sent
            </CardTitle>
            <CardDescription className="text-lg text-sky-500 font-bold">
              {(statsBenefStakeholders?.beneficiary?.VOICE?.TOTAL || 0) +
                (statsBenefStakeholders?.stakeholder?.VOICE?.TOTAL || 0)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row">
            <div className="flex justify-center xl:justify-start w-full">
              <div className="w-full max-w-[350px] aspect-square">
                <PieChart
                  chart={{
                    series: [
                      {
                        label: 'Successfully Delivered AVC',
                        value:
                          (statsBenefStakeholders?.beneficiary?.VOICE
                            ?.SUCCESS || 0) +
                            (statsBenefStakeholders?.stakeholder?.VOICE
                              ?.SUCCESS || 0) || 0,
                      },
                      {
                        label: 'AVC Delivery Failures',
                        value:
                          (statsBenefStakeholders?.beneficiary?.VOICE?.FAIL ||
                            0) +
                            (statsBenefStakeholders?.stakeholder?.VOICE?.FAIL ||
                              0) || 0,
                      },
                    ],
                    colors: ['#43A047', '#E53935'],
                  }}
                  custom={true}
                  projectAA={true}
                  width={'100%'}
                  height={'100%'}
                  donutSize="80%"
                  type="donut"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 ">
              {[
                {
                  label: 'Unique AVC Recipients',
                  value:
                    commsStatsData?.stats?.transportStats.find(
                      (r) => r.name === 'VOICE',
                    )?.totalRecipients || 0,
                },
                {
                  label: 'Successfully Delivered',
                  value:
                    (statsBenefStakeholders?.beneficiary?.VOICE?.SUCCESS || 0) +
                      (statsBenefStakeholders?.stakeholder?.VOICE?.SUCCESS ||
                        0) || 0,
                },

                {
                  label: 'AVC Delivery Failures',
                  value:
                    (statsBenefStakeholders?.beneficiary?.VOICE?.FAIL || 0) +
                      (statsBenefStakeholders?.stakeholder?.VOICE?.FAIL || 0) ||
                    0,
                },
                {
                  label: 'AVC Successfully sent to Beneficiaries',
                  value:
                    statsBenefStakeholders?.beneficiary?.VOICE?.SUCCESS || 0,
                },
                {
                  label: 'AVC Successfully sent to Stakeholders',
                  value: statsBenefStakeholders?.stakeholder?.VOICE?.SUCCESS,
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
