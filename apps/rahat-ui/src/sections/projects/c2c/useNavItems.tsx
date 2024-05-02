import { LayoutDashboard, UserRound, Coins, Blocks } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  ProjectNavItemsReturnType,
  NavItem,
} from '../components/nav-items.types';
import { parseEther } from 'viem';
import { useSendTransaction } from 'wagmi';
import DepositTokenModal from './components/token/depositToken.modal';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

export const useNavItems = (): ProjectNavItemsReturnType => {
  const { id } = useParams();
  const { sendTransaction } = useSendTransaction();

  const depositTokenModal = useBoolean();
  const handleOpenDepositToken = () => {
    depositTokenModal.onToggle();
  };

  const handleDepositToken = () => {
    return sendTransaction({
      to: `0x491A0ae888449A9cE02f3F4288EFD9D5065c16C9`,
      value: parseEther('0.1'),
    });
  };

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
              <DepositTokenModal handleModal={handleOpenDepositToken} />
            </>
          ),
          title: 'Deposit Token',
        },
        {
          icon: <Blocks size={18} strokeWidth={1.5} />,
          title: 'Request Token',
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
