'use client';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useCommuicationStatsforBeneficiaryandStakeHolders } from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import DynamicPieChart from '../../../components/dynamicPieChart';

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
  const t = useTranslations('AA Project');
  const formatNum = useNumberFormat();
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* SMS Card */}
        <Card className="shadow-sm rounded-sm flex-1 w-full">
          <CardHeader className="pb-0 pt-1">
            <CardTitle className="text-xl font-semibold text-gray-600">
              {t('TOTAL_SMS_SENT')}
            </CardTitle>
            <CardDescription className="text-lg text-sky-500 font-bold">
              {formatNum((statsBenefStakeholders?.beneficiary?.SMS?.TOTAL || 0) +
                (statsBenefStakeholders?.stakeholder?.SMS?.TOTAL || 0))}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row  ">
            <div className="flex justify-center xl:justify-start w-full">
              <div className="w-full max-w-[350px] aspect-square">
                <DynamicPieChart
                  pieData={[
                    {
                      label: t('SUCCESSFULLY_DELIVERED_SMS'),
                      value:
                        (statsBenefStakeholders?.beneficiary?.SMS?.SUCCESS ||
                          0) +
                        (statsBenefStakeholders?.stakeholder?.SMS?.SUCCESS ||
                          0),
                    },
                    {
                      label: t('SMS_DELIVERY_FAILURES'),
                      value:
                        (statsBenefStakeholders?.beneficiary?.SMS?.FAIL || 0) +
                        (statsBenefStakeholders?.stakeholder?.SMS?.FAIL || 0),
                    },
                  ]}
                  colors={['#43A047', '#E53935']}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-1">
              {[
{
                    label: t('SUCCESSFULLY_DELIVERED'),
                    value:
                      formatNum((statsBenefStakeholders?.beneficiary?.SMS?.SUCCESS || 0) +
                        (statsBenefStakeholders?.stakeholder?.SMS?.SUCCESS ||
                          0) || 0),
                  },
                  {
                    label: t('SMS_DELIVERY_FAILURES'),
                   value:
                     formatNum((statsBenefStakeholders?.beneficiary?.SMS?.FAIL || 0) +
                       (statsBenefStakeholders?.stakeholder?.SMS?.FAIL || 0) ||
                     0),
                 },
                  {
                    label: t('SMS_SUCCESSFULLY_SENT_TO_BENEFICIARIES'),
                   value: formatNum(statsBenefStakeholders?.beneficiary?.SMS?.SUCCESS || 0),
                 },
                  {
                    label: t('SMS_SUCCESSFULLY_SENT_TO_STAKEHOLDERS'),
                   value: formatNum(statsBenefStakeholders?.stakeholder?.SMS?.SUCCESS || 0),
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
              {t('TOTAL_AVC_SENT')}
            </CardTitle>
            <CardDescription className="text-lg text-sky-500 font-bold">
              {formatNum((statsBenefStakeholders?.beneficiary?.VOICE?.TOTAL || 0) +
                (statsBenefStakeholders?.stakeholder?.VOICE?.TOTAL || 0))}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between flex-col xl:flex-row">
            <div className="flex justify-center xl:justify-start w-full">
              <div className="w-full max-w-[350px] aspect-square">
                <DynamicPieChart
                  pieData={[
                    {
                      label: t('SUCCESSFULLY_DELIVERED_AVC'),
                      value:
                        (statsBenefStakeholders?.beneficiary?.VOICE?.SUCCESS ||
                          0) +
                          (statsBenefStakeholders?.stakeholder?.VOICE
                            ?.SUCCESS || 0) || 0,
                    },
                    {
                      label: t('AVC_DELIVERY_FAILURES'),
                      value:
                        (statsBenefStakeholders?.beneficiary?.VOICE?.FAIL ||
                          0) +
                          (statsBenefStakeholders?.stakeholder?.VOICE?.FAIL ||
                            0) || 0,
                    },
                  ]}
                  colors={['#43A047', '#E53935']}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 ">
              {[
                {
                  label: t('UNIQUE_AVC_RECIPIENTS'),
                  value: formatNum(
                    commsStatsData?.stats?.transportStats.find(
                      (r) => r.name === 'VOICE',
                    )?.totalRecipients || 0),
                },
                {
                  label: t('SUCCESSFULLY_DELIVERED'),
                  value: formatNum(
                    (statsBenefStakeholders?.beneficiary?.VOICE?.SUCCESS || 0) +
                      (statsBenefStakeholders?.stakeholder?.VOICE?.SUCCESS ||
                        0)) || 0,
                },

                {
                  label: t('AVC_DELIVERY_FAILURES'),
                  value: formatNum(
                    (statsBenefStakeholders?.beneficiary?.VOICE?.FAIL || 0) +
                      (statsBenefStakeholders?.stakeholder?.VOICE?.FAIL || 0)) ||
                    0,
                },
                {
                  label: t('AVC_SUCCESSFULLY_SENT_TO_BENEFICIARIES'),
                  value: formatNum(
                    statsBenefStakeholders?.beneficiary?.VOICE?.SUCCESS || 0),
                },
                {
                  label: t('AVC_SUCCESSFULLY_SENT_TO_STAKEHOLDERS'),
                  value: formatNum(
                    statsBenefStakeholders?.stakeholder?.VOICE?.SUCCESS || 0),
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
