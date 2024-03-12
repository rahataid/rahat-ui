import {
  Pencil,
  PlusSquare,
  Speech,
  Store,
  UsersRound,
  XCircle,
  Ticket,
  Lock,
} from 'lucide-react';
import { useSwal } from '../../../components/swal';

export type NavItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  subtitle?: string | number;
  onClick?: () => void;
  children?: NavItem[];
};

export const useNavItems = () => {
  const dialog = useSwal();
  // const beneficiary = useBeneficiaryStore(state=>state.beneficiary)

  const handleCreateToken = async () => {
    const { value } = await dialog.fire({
      title: 'Create Token',
      text: 'Create a token for the project',
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      input: 'text',
    });
    if (value) {
      dialog.fire({
        title: 'Token Created',
        text: `Token ${value} has been created successfully`,
        icon: 'success',
      });
    }
  };

  const handleCreateVoucher = async () => {
    const { value } = await dialog.fire({
      title: 'Create Voucher',
      text: 'Create a voucher for the project',
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      input: 'text',
    });
    if (value) {
      dialog.fire({
        title: 'Voucher Created',
        text: `Voucher ${value} has been created successfully`,
        icon: 'success',
      });
    }
  };

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
      title: `Project Details`,
      children: [
        {
          title: 'Beneficiaries',
          path: '',
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: '/vendors',
          subtitle: 20,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: '/transactions',
          subtitle: 20,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Campaigns',
          path: '/campaigns',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Create Token',
          icon: <Ticket size={18} strokeWidth={1.5} />,
          onClick: handleCreateToken,
        },
        {
          title: 'Create Voucher',
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
          onClick: handleCreateVoucher,
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
          path: '/edit',
          icon: <Pencil size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return navItems;
};
