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

  const totalDistributed = totalFundDistributed?.data?.benTokensAssigneds?.reduce((accumulator: number,d: any, ) => {
    return Number(d.amount) + accumulator
  }, 0) ?? 0;


  const parsedProjectBudget = Number(projectBudget);

  const projectBalance = parsedProjectBudget - Number(totalDistributed);

  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedProjectBudget);

  const formattedTotalDistributed = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalDistributed);

  const formattedProjectBalance = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(projectBalance);

  const totalBeneficiaries = allStats?.filter(
    (data: any) => data.name === 'BENEFICIARY_TOTAL',
  )[0]?.data?.count;

  const totalHouseholdReceivingCashSupport = allStats?.filter(
    (data: any) => data.name === 'BENEFICIARY_HOUSEHOLDCASHSUPPORT',
  )[0]?.data?.householdCashSupport;

  const data = [
    {
      title: 'Total Beneficiaries',
      Icon: UsersRound,
      number: totalBeneficiaries ?? 0,
    },
    {
      title: 'Household Receiving Cash Support',
      Icon: Home,
      number: totalHouseholdReceivingCashSupport ?? 0,
    },
    {
      title: 'Budget',
      Icon: Coins,
      number: `NRs. ${formattedBudget ?? 0}`,
    },
    {
      title: 'Balance',
      Icon: Coins,
      number: `NRs. ${formattedProjectBalance ?? 0}`,
    },
    {
      title: 'Fund Distributed',
      Icon: HandCoins,
      number: `NRs. ${formattedTotalDistributed ?? 0}`,
    },
    {
      title: 'Number of Communication Project',
      Icon: SmartphoneNfc,
      number: commsStats?.totalCommsProject ?? 'N/A',
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
