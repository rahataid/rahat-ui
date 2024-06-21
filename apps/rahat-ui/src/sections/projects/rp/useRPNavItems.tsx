import {
  Coins,
  LayoutDashboard,
  Pencil,
  Plus,
  PlusSquare,
  Receipt,
  Speech,
  Store,
  UsersRound,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { NavItem } from '../components';
import CreateTokenModal from './create.token.modal';

export const useNavItems = () => {
  const { id } = useParams();

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/rp/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/rp/${id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/rp/${id}/vendors`,
          subtitle: 20,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/rp/${id}/transactions`,
          subtitle: 20,
          icon: <Receipt size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Fund Management',
          path: `/projects/rp/${id}/fundManagement`,
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Campaigns',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/rp/${id}/campaigns/text`,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          component: (
            <>
              <CreateTokenModal />
            </>
          ),
          title: 'Create Token',
        },

        {
          title: 'Close Project',
          path: '/edit',
          icon: <XCircle size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Edit Project',
          path: `/projects/rp/${id}/edit`,
          icon: <Pencil size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Create Beneficiary',
          path: `/projects/rp/${id}/beneficiary/add`,
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Add Campaign',
          path: `/projects/rp/${id}/campaigns/add`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
