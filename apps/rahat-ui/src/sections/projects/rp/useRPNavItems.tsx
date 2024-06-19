import {
  Coins,
  LayoutDashboard,
  Lock,
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
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';
import CreateTokenModal from './create.token.modal';

export const useNavItems = () => {
  const { id, params } = useParams();
  const dialog = useSwal();
  // const beneficiary = useBeneficiaryStore(state=>state.beneficiary)

  const handleLockProject = async () => {
    const { value } = await dialog.fire({
      title: 'Lock Project',
      text: 'Are you sure you want to lock the project?',
      showCancelButton: true,
      confirmButtonText: 'Lock',
    });
    if (value) {
      dialog.fire({
        title: 'Project Locked',
        text: 'Project has been locked successfully',
        icon: 'success',
      });
    }
  };

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
          title: 'Lock Project',
          icon: <Lock size={18} strokeWidth={1.5} />,
          onClick: handleLockProject,
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
