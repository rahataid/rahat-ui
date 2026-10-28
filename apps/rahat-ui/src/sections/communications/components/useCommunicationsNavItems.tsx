import { useCampaignStore } from '@rumsan/react-query';
import { Speech, Plus, FilePenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { NavItem } from '.';

export const useNavItems = () => {
  const t = useTranslations('COMMUNICATIONS_NAVIGATION');
  const router = useRouter();
  const totalTextCampaign = useCampaignStore().totalTextCampaign;

  const handleGoBack = () => {
    router.back();
  };

  const navItems: NavItem[] = [
    {
      title: t('COMMUNICATIONS'),
      children: [
        {
          title: t('CAMPAIGNS'),
          onClick: handleGoBack,
          subtitle: totalTextCampaign,
          icon: <Speech size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: t('ACTIONS'),
      children: [
        {
          title: t('ADD_CAMPAIGN'),
          path: `/communications/add`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return navItems;
};
