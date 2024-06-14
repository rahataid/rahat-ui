import {
  Coins,
  HandCoins,
  Home,
  LucideIcon,
  SmartphoneNfc,
  UsersRound,
} from 'lucide-react';

const data = [
  {
    title: 'Total Beneficiaries',
    Icon: UsersRound,
    number: '244',
  },
  {
    title: 'Household Receiving Cash Support',
    Icon: Home,
    number: '244',
  },
  {
    title: 'Budget',
    Icon: Coins,
    number: '2,94,334',
  },
  {
    title: 'Balance',
    Icon: Coins,
    number: '2,94,334',
  },
  {
    title: 'Fund Distributed',
    Icon: HandCoins,
    number: '2,94,334',
  },
  {
    title: 'Number of Communication Project',
    Icon: SmartphoneNfc,
    number: '244',
  },
];

type ICardProps = {
  title: string;
  Icon: LucideIcon;
  number: string;
};

const DataCard = ({ title, Icon, number }: ICardProps) => {
  return (
    <div className="rounded-sm bg-card p-4">
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

export default function SimpleDataCardsContainer() {
  return (
    <div className="grid grid-cols-3 gap-4">
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
