import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  ArrowLeftRight,
  Coins,
  Expand,
  FilePlus2,
  LayoutDashboard,
  MessageSquareText,
  PencilRuler,
  PersonStanding,
  Plus,
  Speech,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import {
  NavItem,
  ProjectNavItemsReturnType,
} from '../components/nav-items.types';
import DepositTokenModal from './components/depositToken.modal';
import RequestTokenModal from './components/request-token-flow/1-request.token';
import path from 'path';

export const useNavItems = (): ProjectNavItemsReturnType => {
  const { id } = useParams();
  const pathname = usePathname();
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
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/c2c/${id}/transactions`,
          icon: <ArrowLeftRight size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Fund Management',
          path: `/projects/c2c/${id}/fundManagement`,
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/c2c/${id}/communication`,
          children: [
            {
              title: 'Text',
              path: `/projects/c2c/${id}/communication/text`,
              icon: <MessageSquareText size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Email',
              path: `/projects/c2c/${id}/communication/email`,
              icon: <MessageSquareText size={18} strokeWidth={1.5} />,
            },
          ],
        },
        {
          title: 'Grievance',
          icon: <PersonStanding size={18} strokeWidth={1.5} />,
          path: `/projects/c2c/${id}/grievance`,
        },
        {
          title: 'Disbursement',
          icon: <Expand size={18} strokeWidth={1.5} />,
          path: `/projects/c2c/${id}/disbursement`,
        },
        {
          component: (
            <>
              <DepositTokenModal handleModal={depositTokenModal} />
            </>
          ),
          title: 'Deposit Token',
        },
        {
          icon: <PencilRuler size={18} strokeWidth={1.5} />,
          title: 'Edit Project',
          path: `/projects/c2c/${id}/edit`,
        },
        ...(pathname.includes('/projects/c2c/') &&
        pathname.includes('/campaigns')
          ? [
              {
                title: 'Add Communication',
                path: `/projects/c2c/${id}/campaigns/add`,
                icon: <Plus size={18} strokeWidth={1.5} />,
              },
            ]
          : []),
        ...(pathname.includes('/projects/c2c/') &&
        pathname.includes('/grievance')
          ? [
              {
                title: 'Add grievance',
                path: `/projects/c2c/${id}/grievance/add`,
                icon: <FilePlus2 size={18} strokeWidth={1.5} />,
              },
            ]
          : []),
      ],
    },
  ];

  return {
    navItems,
  };
};
