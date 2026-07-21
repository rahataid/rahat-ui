import { useRouter } from 'next/navigation';
import { useCampaignStore } from '@rumsan/communication-query';
import { NavItem } from './components';
import { Speech } from 'lucide-react';
import { paths } from '../../routes/paths';
import { useTranslations } from 'next-intl';

export const useNavItems = () => {
    const t = useTranslations('Communications – Navigation');
    const router = useRouter()
    const totalTextCampaign = useCampaignStore().totalTextCampaign;
    const handleGoBack = () => {
        router.back()
    }
    const navItems: NavItem[] = [
        {
            title: t('COMMUNICATIONS'),
            children: [
                {
                    title: t('TEXT_CAMPAIGNS'),
                    onClick: () => router.push(paths.dashboard.communication.text),
                    subtitle: totalTextCampaign || 0,
                    icon: <Speech size={18} strokeWidth={1.5} />,
                },
            ],
        },
    ];

    return navItems;
};
