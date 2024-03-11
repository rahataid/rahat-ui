import {
  Pencil,
  PlusSquare,
  Speech,
  Store,
  UsersRound,
  XCircle,
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

  const navItems: NavItem[] = [
    {
      title: `Project Details`,
      children: [
        {
          title: 'Beneficiaries',
          path: '',
          // subtitle: beneficiary.project.length,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: '/vendors',
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
          title: 'Create Voucher',
          path: '/edit',
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
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
    {
      title: '',
      children: [
        {
          title: 'Create Token',
          onClick: handleCreateToken,
        },
        {
          title: 'Create Voucher',
          onClick: handleCreateToken,
        },
      ],
    },
  ];

  return navItems;
};
