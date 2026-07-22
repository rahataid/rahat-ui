import { Speech, FilePenLine, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCampaignStore } from '@rumsan/communication-query';
import { NavItem } from '../components/nav-items.types';
import { useTranslations } from 'next-intl';

export const useNavItems = () => {
  const t = useTranslations('Communications – Navigation');
  const params = useParams();
  const totalTextCampaign = useCampaignStore().totalTextCampaign;
  const campaign = useCampaignStore().campaign;

  const navItems: NavItem[] = [
    {
      title: t('COMMUNICATIONS_TEXT'),
      children: [
        {
          title: t('CAMPAIGNS'),
          path: '/communications/text',
          subtitle: totalTextCampaign || 0,
          icon: <Speech size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: t('ACTIONS'),
      children: [
        ...(params.id?.length && campaign?.data.status !== 'COMPLETED'
          ? [
              {
                title: t('EDIT_CAMPAIGN'),
                path: `/communications/text/${params.id}/edit`,
                icon: <FilePenLine size={18} strokeWidth={1.5} />,
              },
            ]
          : [
              {
                title: t('ADD_CAMPAIGN'),
                path: '/communications/add',
                icon: <Plus size={18} strokeWidth={1.5} />,
              },
            ]),
      ],
    },
  ];

  return navItems;
};
