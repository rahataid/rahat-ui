import {
  ArrowRightLeft,
  CloudOff,
  Gift,
  HandCoins,
  LayoutDashboard,
  Speech,
  Ticket,
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
          path: `/projects/el-kenya/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/el-kenya/${id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/el-kenya/${id}/communication`,
        },
        {
          title: 'Vouchers',
          path: `/projects/el-kenya/${id}/vouchers`,
          icon: <Ticket size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el-kenya/${id}/transactions`,
          subtitle: 20,
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/el-kenya/${id}/vendors`,
          subtitle: 20,
          icon: <HandCoins size={18} strokeWidth={1.5} />,
        },

        {
          title: 'Offline Management',
          path: `/projects/el-kenya/${id}/offline-management`,
          icon: <CloudOff size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Claim',
          path: `/projects/el-kenya/${id}/claim`,
          icon: <Gift size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
