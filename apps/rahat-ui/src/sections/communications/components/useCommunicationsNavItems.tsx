import { useCampaignStore } from '@rumsan/react-query';
import { Speech, Plus, FilePenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NavItem } from '.';

export const useNavItems = () => {
  const router = useRouter();
  const totalTextCampaign = useCampaignStore().totalTextCampaign;

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
          subtitle: totalTextCampaign,
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
