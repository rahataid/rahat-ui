'use client';
import { useTranslations } from 'next-intl';
import { useChartNumberOptions } from 'apps/rahat-ui/src/utils/i18n/number';
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
  titleKey,
  channelLabel,
  stats,
}: {
  titleKey: string;
  channelLabel: 'SMS' | 'AVC';
  stats: ReturnType<typeof getChannelStats>;
}) {
  const t = useTranslations('AA_PROJECT');
  const { formatNum, chartOptions } = useChartNumberOptions();

  const deliveredKey = `SUCCESSFULLY_DELIVERED_${channelLabel}` as any;
  const failuresKey = `${channelLabel}_DELIVERY_FAILURES` as any;

  const rows = [
    { label: t('SUCCESSFULLY_DELIVERED'), value: formatNum(stats.SUCCESS) },
    { label: t(failuresKey), value: formatNum(stats.FAIL) },
    { label: t('SCHEDULED'), value: formatNum(stats.SCHEDULED) },
    { label: t('PENDING'), value: formatNum(stats.PENDING) },
  ];

  return (
    <Card className="shadow-sm rounded-sm flex-1 w-full">
      <CardHeader className="pb-0 pt-1">
        <CardTitle className="text-xl font-semibold text-gray-600">
          {t(titleKey as any)}
        </CardTitle>
        <CardDescription className="text-lg text-sky-500 font-bold">
          {formatNum(stats.TOTAL)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between flex-col xl:flex-row">
        <div className="flex justify-center xl:justify-start w-full">
          <div className="w-full max-w-[280px] aspect-square">
            <DynamicPieChart
              pieData={[
                { label: t(deliveredKey), value: stats.SUCCESS },
                { label: t(failuresKey), value: stats.FAIL },
              ]}
              colors={['#43A047', '#E53935']}
              options={{
                tooltip: {
                  fillSeriesColor: true,
                  ...chartOptions.tooltip,
                },
              }}
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
      titleKey: 'TOTAL_SMS_SENT',
      channelLabel: 'SMS' as const,
      stats: getChannelStats(statsBenefStakeholders, 'SMS'),
    },
    {
      titleKey: 'TOTAL_AVC_SENT',
      channelLabel: 'AVC' as const,
      stats: getChannelStats(statsBenefStakeholders, 'VOICE'),
    },
    {
      titleKey: 'TOTAL_SMS_SENT_TO_BENEFICIARIES',
      channelLabel: 'SMS' as const,
      stats: getChannelStats(statsBenefStakeholders, 'SMS', 'beneficiary'),
    },
    {
      titleKey: 'TOTAL_AVC_SENT_TO_BENEFICIARIES',
      channelLabel: 'AVC' as const,
      stats: getChannelStats(statsBenefStakeholders, 'VOICE', 'beneficiary'),
    },
    {
      titleKey: 'TOTAL_SMS_SENT_TO_STAKEHOLDERS',
      channelLabel: 'SMS' as const,
      stats: getChannelStats(statsBenefStakeholders, 'SMS', 'stakeholder'),
    },
    {
      titleKey: 'TOTAL_AVC_SENT_TO_STAKEHOLDERS',
      channelLabel: 'AVC' as const,
      stats: getChannelStats(statsBenefStakeholders, 'VOICE', 'stakeholder'),
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {charts.map((chart) => (
          <CommsPieCard key={chart.titleKey} {...chart} />
        ))}
      </div>
    </div>
  );
}
