import { usePagination } from '@rahat-ui/query';
import { KanbanSquare } from 'lucide-react';
import { paths } from '../../routes/paths';
import { NavItem } from './nav-items.types';

export const useCommunityBeneficiaryNavItems = () => {
  const { setFilters } = usePagination();

  const menuItems: NavItem[] = [
    {
      title: 'Beneficiaries',
      component: (
        <div className="flex justify-between items-center border-6 w-full">
          <h1 className="font-semibold text-xl text-primary">Beneficiaries</h1>
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
