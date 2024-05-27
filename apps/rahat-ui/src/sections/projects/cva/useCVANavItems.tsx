import {
  Lock,
  Pencil,
  Plus,
  PlusSquare,
  Receipt,
  Speech,
  Store,
  Ticket,
  UsersRound,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';

export const useNavItems = () => {
  const params = useParams();
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
      title: 'Project Details',
      children: [
        {
          title: 'Beneficiaries',
          path: `/projects/cva/${params.id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/cva/${params.id}/vendors`,
          subtitle: 20,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/cva/${params.id}/transactions`,
          subtitle: 20,
          icon: <Receipt size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Campaigns',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/cva/${params.id}/campaigns/text`,

          // children: [
          //   {
          //     title: 'Voice',
          //     subtitle: 10,
          //     icon: <Phone size={18} strokeWidth={1.5} />,
          //     path: `/projects/cva/${params.id}/campaigns/voice`,
          //   },
          //   {
          //     title: 'Text',
          //     subtitle: 10,
          //     icon: <MessageSquare size={18} strokeWidth={1.5} />,
          //     path: `/projects/cva/${params.id}/campaigns/text`,
          //   },
          // ],
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
        {
          title: 'Add Campaign',
          path: `/projects/cva/${params.id}/campaigns/add`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return { navItems };
};
