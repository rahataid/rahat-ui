import {
  ArrowRightLeft,
  Coins,
  LayoutDashboard,
  PlusSquare,
} from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useTreasuryNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'General',
      children: [
        {
          title: 'Portfolio',
          path: '/treasury/portfolio',
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
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
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
