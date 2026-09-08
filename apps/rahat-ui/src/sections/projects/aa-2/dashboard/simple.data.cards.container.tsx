import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { Home, LucideIcon, UsersRound } from 'lucide-react';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

type IProps = {
  allStats: any;
  projectId?: UUID;
  commsStats?: any;
};

type ICardProps = {
  title: string;
  Icon: LucideIcon;
  number: string;
};

const DataCard = ({ title, Icon, number }: ICardProps) => {
  return (
    <div className="rounded-sm bg-card p-4 border shadow-sm">
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
  commsStats,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
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
      number: formatNum(totalHouseholdReceivingCashSupport ?? 0),
    },
  ];
  return (
    <div className="flex flex-col gap-7">
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
