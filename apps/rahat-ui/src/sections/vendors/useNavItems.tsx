import { Anchor } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useVendorsNavItems = () => {
    const menuItems: NavItem[] = [
        {
            title: 'Vendors',
            children: [
                {
                    title: 'Vendors',
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
