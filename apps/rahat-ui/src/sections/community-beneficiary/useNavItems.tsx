import { usePagination } from '@rahat-ui/query';
import { KanbanSquare } from 'lucide-react';
import { paths } from '../../routes/paths';
import { NavItem } from './nav-items.types';
import { useTranslations } from 'next-intl';

export const useCommunityBeneficiaryNavItems = () => {
  const tg = useTranslations('GLOBAL');
  const { setFilters } = usePagination();

  const menuItems: NavItem[] = [
    {
      title: tg('BENEFICIARIES'),
      component: (
        <div className="flex justify-between items-center border-6 w-full">
          <h1 className="font-semibold text-xl text-primary">{tg('BENEFICIARIES')}</h1>
        </div>
      ),
      children: [
        // {
        //   title: 'Temporary Beneficiaries',
        //   icon: <KanbanSquare size={18} strokeWidth={1.5} />,
        //   path: paths.dashboard.communitybeneficiary,
        // },
        {
          title: 'Temp Group List',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
          path: paths.dashboard.communitybeneficiary,
        },
      ],
    },
  ];
  return menuItems;
};
