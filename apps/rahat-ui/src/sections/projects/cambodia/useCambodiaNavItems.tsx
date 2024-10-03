import {
  ArrowLeftRight,
  Coins,
  Hospital,
  LayoutDashboard,
  SmartphoneNfc,
  Users,
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
          path: `/projects/el-cambodia/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Benificiaries',
          path: `/projects/el-cambodia/${id}/beneficiary`,
          subtitle: 20,
          icon: <Users size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vision Center',
          path: `/projects/el-cambodia/${id}/vendors`,
          subtitle: 20,
          icon: <Hospital size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el-cambodia/${id}/transactions`,
          subtitle: 20,
          icon: <ArrowLeftRight size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Commission Scheme',
          path: `/projects/el-cambodia/${id}/commission`,
          subtitle: 20,
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Health Worker',
          path: `/projects/el-cambodia/${id}/chw`,
          subtitle: 20,
          icon: <Users size={18} strokeWidth={1.5} />,
        },
        // {
        //   title: 'Communication',
        //   path: `/projects/el-cambodia/${id}/communication`,
        //   subtitle: 20,
        //   icon: <SmartphoneNfc size={18} strokeWidth={1.5} />,
        // },
      ],
    },
  ];

  return {
    navItems,
  };
};
