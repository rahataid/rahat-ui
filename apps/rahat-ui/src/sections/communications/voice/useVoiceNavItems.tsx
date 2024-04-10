import { Speech, FilePenLine, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
// import { useCampaignStore } from '@rumsan/communication-query';
import { NavItem } from '../components/nav-items.types';

export const useNavItems = () => {
    const params = useParams();
    // const totalTextCampaign = useCampaignStore().totalTextCampaign;
    const navItems: NavItem[] = [
        {
            title: 'Communications : Voice',
            children: [
                {
                    title: 'Campaigns',
                    path: '/communications/voice',
                    subtitle: 0,
                    icon: <Speech size={18} strokeWidth={1.5} />,
                },
            ],
        },
        {
            title: 'Actions',
            children: [
                ...(params.id?.length
                    ? [
                        {
                            title: 'Edit Campaign',
                            path: `/communications/voice/${params.id}/edit`,
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
