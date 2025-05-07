import {
  ArrowRightLeft,
  HandCoins,
  LayoutDashboard,
  UsersRound,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { NavItem } from '../components';

export const useNavItems = () => {
  const { id } = useParams();

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/sms-voucher/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Consumers',
          path: `/projects/sms-voucher/${id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/sms-voucher/${id}/transactions`,
          subtitle: 20,
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/sms-voucher/${id}/vendors`,
          subtitle: 20,
          icon: <HandCoins size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
