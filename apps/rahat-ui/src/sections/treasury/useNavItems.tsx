import { Anchor } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useTreasuryNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Treasury',
      children: [
        {
          title: 'Treasury',
          icon: <Anchor size={18} strokeWidth={1.5} />,
        },
      ],
    },
    // {
    //     title: 'Actions',
    //     children: [
    //         {
    //             title: 'Assign Projects',
    //         },
    //     ],
    // },
  ];
  return menuItems;
};
