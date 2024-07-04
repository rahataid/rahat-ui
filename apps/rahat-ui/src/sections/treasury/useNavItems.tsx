import {
  ArrowRightLeft,
  BriefcaseBusiness,
  Coins,
  LayoutDashboard,
  PlusSquare,
} from 'lucide-react';
import { NavItem } from './nav-items.types';
import { useParams } from 'next/navigation';

export const useTreasuryNavItems = () => {
  const { id } = useParams();
  const menuItems: NavItem[] = [
    {
      title: 'General',
      children: [
        {
          title: 'Projects',
          path: `/projects/rp/${id}`,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: '/treasury/transactions',
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Portfolio',
          path: '/treasury/portfolio',
          icon: <BriefcaseBusiness size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Assets',
          path: '/treasury/assets',
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Create Token',
          path: `/treasury/createToken`,
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};
