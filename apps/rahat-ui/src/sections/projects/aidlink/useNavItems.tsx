import {
  ClockFading,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Navigation,
  UsersRound,
  Wallet,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  NavItem,
  ProjectNavItemsReturnType,
} from '../components/nav-items.types';

export const useNavItems = (): ProjectNavItemsReturnType => {
  const { id } = useParams();

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/aidlink/${id}`,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/aidlink/${id}/beneficiary`,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Disbursement',
          icon: <Navigation size={18} strokeWidth={1.5} />,
          path: `/projects/aidlink/${id}/disbursement`,
        },
        {
          title: 'Multisig Wallet',
          icon: <Wallet size={18} strokeWidth={1.5} />,
          path: `/projects/aidlink/${id}/multisig-wallet`,
        },
        {
          title: 'Reporting',
          icon: <FileText size={18} strokeWidth={1.5} />,
          path: `/projects/aidlink/${id}/reporting`,
        },
        // {
        //   title: 'Communication Log',
        //   icon: <MessageSquare size={18} strokeWidth={1.5} />,
        //   path: `/projects/aidlink/${id}/communication-log`,
        // },
        {
          title: 'Transaction History',
          icon: <ClockFading size={18} strokeWidth={1.5} />,
          path: `/projects/aidlink/${id}/transaction-history`,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
