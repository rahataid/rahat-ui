import { usePagination } from '@rahat-ui/query';
import {
  AlignJustify,
  Import,
  LayoutGrid,
  List,
  ListCollapse,
  Plus,
} from 'lucide-react';
import { NavItem } from './nav-items.types';
import { paths } from '../../routes/paths';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';

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

  const menuItems: NavItem[] = [
    {
      title: 'Beneficiaries',
      component: (
        <div className="flex justify-between items-center border-6 w-full">
          <h1 className="font-semibold text-xl text-primary">Beneficiaries</h1>
          <TabsList defaultValue="list" className="border rounded">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      ),
      children: [
        {
          title: 'Beneficiary List',
          path: `${paths.dashboard.beneficiary.root}`,
          icon: <List size={18} strokeWidth={1.5} />,
        },
        {
          title: ' Group List',
          path: `${paths.dashboard.group.root}`,
          icon: <List size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Add Beneficiaries',
          path: `${paths.dashboard.beneficiary.add}`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Import Beneficiaries',
          path: `${paths.dashboard.beneficiary.import}`,
          icon: <Import size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Add Group',
          path: `${paths.dashboard.group.root}`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};
