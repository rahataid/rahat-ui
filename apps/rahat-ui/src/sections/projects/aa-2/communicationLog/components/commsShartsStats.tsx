'use client';
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
  FAIL?: number;
  SCHEDULED?: number;
  PENDING?: number;
};

type RoleType = 'beneficiary' | 'stakeholder';

type CommunicationBeneficiaryStakeholdersReport = {
  [role in RoleType]: {
    [channel in ChannelType]?: CommunicationStats;
  };
};

type CommunicationsChartsStatsProps = {
  statsBenefStakeholders?: CommunicationBeneficiaryStakeholdersReport;
};

function getChannelStats(
  stats: CommunicationBeneficiaryStakeholdersReport | undefined,
  channel: ChannelType,
  role?: RoleType,
) {
  const roles: RoleType[] = role ? [role] : ['beneficiary', 'stakeholder'];
  return roles.reduce(
    (acc, r) => {
      const s = stats?.[r]?.[channel];
      acc.SUCCESS += s?.SUCCESS || 0;
      acc.FAIL += s?.FAIL || 0;
      acc.SCHEDULED += s?.SCHEDULED || 0;
      acc.PENDING += s?.PENDING || 0;
      acc.TOTAL += s?.TOTAL || 0;
      return acc;
    },
    { SUCCESS: 0, FAIL: 0, SCHEDULED: 0, PENDING: 0, TOTAL: 0 },
  );
}

function CommsPieCard({
  title,
  channelLabel,
  stats,
}: {
  title: string;
  channelLabel: string;
  stats: ReturnType<typeof getChannelStats>;
}) {
  const rows = [
    { label: 'Successfully Delivered', value: stats.SUCCESS },
    { label: `${channelLabel} Delivery Failures`, value: stats.FAIL },
    { label: 'Scheduled', value: stats.SCHEDULED },
    { label: 'Pending', value: stats.PENDING },
  ];

  return (
    <Card className="shadow-sm rounded-sm flex-1 w-full">
      <CardHeader className="pb-0 pt-1">
        <CardTitle className="text-xl font-semibold text-gray-600">
          {title}
        </CardTitle>
        <CardDescription className="text-lg text-sky-500 font-bold">
          {stats.TOTAL}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between flex-col xl:flex-row">
        <div className="flex justify-center xl:justify-start w-full">
          <div className="w-full max-w-[280px] aspect-square">
            <DynamicPieChart
              pieData={[
                {
                  label: `Successfully Delivered ${channelLabel}`,
                  value: stats.SUCCESS,
                },
                {
                  label: `${channelLabel} Delivery Failures`,
                  value: stats.FAIL,
                },
              ]}
              colors={['#43A047', '#E53935']}
            />
          </div>
        </div>

        <div className="grid grid-cols-2">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex flex-col flex-wrap bg-white">
              <p className="text-sm text-gray-600 text-wrap">{label}</p>
              <p className="text-lg font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunicationsChartsStats({
  statsBenefStakeholders,
}: CommunicationsChartsStatsProps) {
  const charts = [
    {
      title: 'Total SMS Sent',
      channelLabel: 'SMS',
      stats: getChannelStats(statsBenefStakeholders, 'SMS'),
    },
    {
      title: 'Total AVC Sent',
      channelLabel: 'AVC',
      stats: getChannelStats(statsBenefStakeholders, 'VOICE'),
    },
    {
      title: 'SMS Sent to Beneficiaries',
      channelLabel: 'SMS',
      stats: getChannelStats(statsBenefStakeholders, 'SMS', 'beneficiary'),
    },
    {
      title: 'AVC Sent to Beneficiaries',
      channelLabel: 'AVC',
      stats: getChannelStats(statsBenefStakeholders, 'VOICE', 'beneficiary'),
    },
    {
      title: 'SMS Sent to Stakeholders',
      channelLabel: 'SMS',
      stats: getChannelStats(statsBenefStakeholders, 'SMS', 'stakeholder'),
    },
    {
      title: 'AVC Sent to Stakeholders',
      channelLabel: 'AVC',
      stats: getChannelStats(statsBenefStakeholders, 'VOICE', 'stakeholder'),
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {charts.map((chart) => (
          <CommsPieCard key={chart.title} {...chart} />
        ))}
      </div>
    </div>
  );
}
