import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  Blocks,
  Coins,
  LayoutDashboard,
  PencilRuler,
  UserRound,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  NavItem,
  ProjectNavItemsReturnType,
} from '../components/nav-items.types';
import DepositTokenModal from './components/depositToken.modal';

export const useNavItems = (): ProjectNavItemsReturnType => {
  const { id } = useParams();

  const depositTokenModal = useBoolean();

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/c2c/${id}`,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/c2c/${id}/beneficiary`,
          icon: <UserRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Fund Management',
          path: `/projects/c2c/${id}/fundManagement`,
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          component: (
            <>
              <DepositTokenModal handleModal={depositTokenModal} />
            </>
          ),
          title: 'Deposit Token',
        },
        {
          icon: <Blocks size={18} strokeWidth={1.5} />,
          title: 'Request Token',
        },
        {
          icon: <PencilRuler size={18} strokeWidth={1.5} />,
          title: 'Edit Project',
          path: `/projects/c2c/${id}/edit`,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
