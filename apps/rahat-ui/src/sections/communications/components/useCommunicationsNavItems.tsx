import { Speech, Plus, FilePenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NavItem } from '.';

export const useNavItems = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const navItems: NavItem[] = [
    {
      title: 'Communications',
      children: [
        {
          title: 'Campaigns',
          onClick: handleGoBack,
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Add Campaign',
          path: `/communications/add`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return navItems;
};
