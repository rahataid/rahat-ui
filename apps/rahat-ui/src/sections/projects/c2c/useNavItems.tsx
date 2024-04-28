import { LayoutDashboard, UserRound } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  ProjectNavItemsReturnType,
  NavItem,
} from '../components/nav-items.types';

export const useNavItems = (): ProjectNavItemsReturnType => {
  const { id } = useParams();
  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/c2c/${id}`,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/c2c/${id}/beneficiary`,
          icon: <UserRound size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
