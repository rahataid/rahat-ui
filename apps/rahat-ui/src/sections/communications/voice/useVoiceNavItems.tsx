import { Speech, FilePenLine, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
// import { useCampaignStore } from '@rumsan/communication-query';
import { NavItem } from '../components/nav-items.types';
import { useTranslations } from 'next-intl';

export const useNavItems = () => {
    const t = useTranslations('Communications – Navigation');
    const params = useParams();
    // const totalTextCampaign = useCampaignStore().totalTextCampaign;
    const navItems: NavItem[] = [
        {
            title: t('COMMUNICATIONS_VOICE'),
            children: [
                {
                    title: t('CAMPAIGNS'),
                    path: '/communications/voice',
                    subtitle: 0,
                    icon: <Speech size={18} strokeWidth={1.5} />,
                },
            ],
        },
        {
            title: t('ACTIONS'),
            children: [
                ...(params.id?.length
                    ? [
                        {
                            title: t('EDIT_CAMPAIGN'),
                            path: `/communications/voice/${params.id}/edit`,
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
