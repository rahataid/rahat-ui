import {
  ProjectNavItemsReturnType,
  NavItem,
} from '../components/nav-items.types';

export const useNavItems = (): ProjectNavItemsReturnType => {
  const navItems: NavItem[] = [
    {
      title: 'Projects',
      children: [
        {
          title: 'Dashboard',
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
