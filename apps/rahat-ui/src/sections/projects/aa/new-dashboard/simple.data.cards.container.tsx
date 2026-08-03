import {
  BeneficiaryAssignedToken,
  GetTotalFundDistributed,
  PROJECT_SETTINGS_KEYS,
  useCommsStats,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useReadAaProjectTokenBudget } from 'apps/rahat-ui/src/hooks/aa/contracts/aaProject';
import { UUID } from 'crypto';
import {
  Coins,
  HandCoins,
  Home,
  LucideIcon,
  SmartphoneNfc,
  UsersRound,
} from 'lucide-react';
import { useQuery } from 'urql';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from '../../../../utils/useNumberFormat';

type IProps = {
  allStats: any;
  projectId: UUID;
  commsStats: any;
};

type ICardProps = {
  title: string;
  Icon: LucideIcon;
  number: string;
};

const DataCard = ({ title, Icon, number }: ICardProps) => {
  return (
    <div className="rounded-sm bg-card p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-md font-medium">{title}</h1>
        <div className="p-2 rounded-full bg-secondary text-primary">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-primary font-semibold text-2xl mt-2">{number}</p>
    </div>
  );
};

export default function SimpleDataCardsContainer({
  allStats,
  projectId,
  commsStats
}: IProps) {

  console.log(commsStats)
  const formatNum = useNumberFormat();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');

  const contractSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const { data: projectBudget } = useReadAaProjectTokenBudget({
    address: contractSettings?.aaproject?.address,
    args: [contractSettings?.rahattoken?.address],
  });

  const [totalFundDistributed] = useQuery({
    query: GetTotalFundDistributed,
  });

  const totalDistributed = totalFundDistributed?.data?.benTokensAssigneds?.reduce((accumulator: number, d: any,) => {
    return Number(d.amount) + accumulator
  }, 0) ?? 0;


  const parsedProjectBudget = Number(projectBudget);

  const projectBalance = parsedProjectBudget - Number(totalDistributed);

  const tempDashboardStats = allStats?.filter(
    (data: any) => data.name === 'TEMP_DASHBOARD_STATS',
  )[0]?.data;

  const totalBeneficiaries = allStats?.filter(
    (data: any) => data.name === 'BENEFICIARY_TOTAL',
  )[0]?.data?.count;

  const totalHouseholdReceivingCashSupport = allStats?.filter(
    (data: any) => data.name === 'BENEFICIARY_HOUSEHOLDCASHSUPPORT',
  )[0]?.data?.householdCashSupport;

  const data = [
    {
      title: t('TOTAL_BENEFICIARIES'),
      Icon: UsersRound,
      number: formatNum(totalBeneficiaries ?? 0),
    },
    {
      title: t('HOUSEHOLD_RECEIVING_CASH_SUPPORT'),
      Icon: Home,
      number: formatNum(tempDashboardStats ? tempDashboardStats.HOUSEHOLD_RECEIVING_CASH : totalHouseholdReceivingCashSupport ?? 0),
    },
    {
      title: t('BUDGET'),
      Icon: Coins,
      number: `${t('RS')} ${formatNum(parsedProjectBudget) ?? 0}`,
    },
    {
      title: t('BALANCE'),
      Icon: Coins,
      number: tempDashboardStats ? `${t('RS')} ${formatNum(tempDashboardStats.BALANCE)}` : `${t('RS')} ${formatNum(projectBalance) ?? 0}`,
    },
    {
      title: t('FUND_DISTRIBUTED'),
      Icon: HandCoins,
      number: tempDashboardStats ? `${t('RS')} ${formatNum(tempDashboardStats.FUND_DISTRIBUTED)}` : `${t('RS')} ${formatNum(totalDistributed) ?? 0}`,
    },
    {
      title: t('NUMBER_OF_COMMUNICATION_PROJECT'),
      Icon: SmartphoneNfc,
      number: commsStats?.totalCommsProject != null ? formatNum(commsStats.totalCommsProject) : tg('N_A'),
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 p-2">
      {data.map((item, index) => (
        <DataCard
          key={index}
          title={item.title}
          Icon={item.Icon}
          number={item.number}
        />
      ))}
    </div>
  );
}
