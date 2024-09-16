import {
  ArrowRightLeft,
  CloudOff,
  Coins,
  Gift,
  HandCoins,
  LayoutDashboard,
  MessageSquareText,
  Speech,
  UsersRound,
  Voicemail,
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
          title: 'Vendors',
          path: `/projects/el-kenya/${id}/vendors`,
          subtitle: 20,
          icon: <HandCoins size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el-kenya/${id}/transactions`,
          subtitle: 20,
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vouchers',
          path: `/projects/el-kenya/${id}/fundManagement`,
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Offline Management',
          path: `/projects/el-kenya/${id}/offlineManagement`,
          icon: <CloudOff size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Reimburse',
          path: `/projects/el-kenya/${id}/redemptions`,
          icon: <Gift size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/el-kenya/${id}/campaigns/text`,
          children: [
            {
              title: 'Text',
              path: `/projects/el-kenya/${id}/campaigns/text`,
              icon: <MessageSquareText size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Voice',
              path: `/projects/el-kenya/${id}/campaigns/voice`,
              icon: <Voicemail size={18} strokeWidth={1.5} />,
            },
          ],
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
