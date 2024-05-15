import { Speech, FilePenLine, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCampaignStore } from '@rumsan/communication-query';
import { NavItem } from '../components/nav-items.types';

export const useNavItems = () => {
  const params = useParams();
  const totalTextCampaign = useCampaignStore().totalTextCampaign;
  const campaign = useCampaignStore().campaign;

  const navItems: NavItem[] = [
    {
      title: 'Communications : Text',
      children: [
        {
          title: 'Campaigns',
          path: '/communications/text',
          subtitle: totalTextCampaign || 0,
          icon: <Speech size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        ...(params.id?.length && campaign?.data.status !== 'COMPLETED'
          ? [
              {
                title: 'Edit Campaign',
                path: `/communications/text/${params.id}/edit`,
                icon: <FilePenLine size={18} strokeWidth={1.5} />,
              },
            ]
          : [
              {
                title: 'Add Campaign',
                path: '/communications/add',
                icon: <Plus size={18} strokeWidth={1.5} />,
              },
            ]),
      ],
    },
  ];

  return navItems;
};
