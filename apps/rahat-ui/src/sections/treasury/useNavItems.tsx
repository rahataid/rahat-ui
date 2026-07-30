import { ArrowRightLeft, Coins, PlusSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NavItem } from './nav-items.types';

export const useTREASURYNavItems = () => {
  const t = useTranslations('TREASURY_NAVIGATION');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const menuItems: NavItem[] = [
    {
      title: t('GENERAL'),
      children: [
        {
          title: t('TRANSACTIONS'),
          path: '/treasury/transactions',
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: t('ASSETS'),
          path: '/treasury/assets',
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: tg('ACTIONS'),
      children: [
        {
          title: t('CREATE_TOKEN'),
          path: `/treasury/createToken`,
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};
