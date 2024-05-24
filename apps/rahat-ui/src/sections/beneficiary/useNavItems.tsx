import { useBeneficiaryStore, usePagination } from '@rahat-ui/query';
import {
  KanbanSquare,
  Archive,
  Plus,
  AlignJustify,
  LayoutGrid,
  Import,
} from 'lucide-react';
import { NavItem } from './nav-items.types';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useBeneficiaryGroupsStore } from 'libs/query/src/lib/beneficiary/beneficiary-groups.store';

const tabs = [
  {
    icon: <AlignJustify size={18} strokeWidth={1.5} />,
    value: 'list',
  },
  {
    icon: <LayoutGrid size={18} strokeWidth={1.5} />,
    value: 'grid',
  },
];

export const useBeneficiaryNavItems = () => {
  const { setFilters } = usePagination();

  const handleFilter = (type: string) => {
    setFilters({ type });
  };
  const totalBeneficiaries = useBeneficiaryStore(
    (state) => state?.meta?.total || 0,
  );

  const totalGroups = useBeneficiaryGroupsStore(
    (state) => state?.meta?.total || 0,
  );

  const menuItems: NavItem[] = [
    {
      title: 'Beneficiaries',
      component: (
        <div className="flex justify-between items-center border-6 w-full">
          <h1 className="font-semibold text-xl text-primary">Beneficiaries</h1>
          {/* <TabsList defaultValue="list" className="border rounded">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon}
              </TabsTrigger>
            ))}
          </TabsList> */}
        </div>
      ),
      children: [
        {
          title: 'Beneficiaries',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
          path: '/beneficiary',
          subtitle: totalBeneficiaries,
        },
        {
          title: 'Beneficiaries Groups',
          icon: <KanbanSquare size={18} strokeWidth={1.5} />,
          path: '/beneficiary/groups',
          subtitle: totalGroups,
        },
        {
          title: 'Archived',
          icon: <Archive size={18} strokeWidth={1.5} />,
          onClick: () => setFilters({ deletedAt: true }),
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Add Beneficiaries',
          path: '/beneficiary/add',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Import Beneficiaries',
          path: '/beneficiary/import',
          icon: <Import size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};
