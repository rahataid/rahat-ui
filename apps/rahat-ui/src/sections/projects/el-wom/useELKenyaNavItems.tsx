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
          path: `/projects/el-wom/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Consumers',
          path: `/projects/el-wom/${id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el-wom/${id}/transactions`,
          subtitle: 20,
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/el-wom/${id}/vendors`,
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
