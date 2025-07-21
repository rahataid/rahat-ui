import {
  ArrowRightLeft,
  CloudOff,
  Coins,
  Gift,
  HandCoins,
  LayoutDashboard,
  MessageSquareText,
  PlusSquare,
  Speech,
  UsersRound,
  Voicemail,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { NavItem } from '../components';

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
          title: 'Transactions',
          path: `/projects/rp/${id}/transactions`,
          subtitle: 20,
          icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Fund Management',
          path: `/projects/rp/${id}/fundManagement`,
          icon: <Coins size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Offline Management',
          path: `/projects/rp/${id}/offlineManagement`,
          icon: <CloudOff size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Redemptions',
          path: `/projects/rp/${id}/redemptions`,
          icon: <Gift size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/rp/${id}/campaigns/text`,
          children: [
            {
              title: 'Text',
              path: `/projects/rp/${id}/campaigns/text`,
              icon: <MessageSquareText size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Voice',
              path: `/projects/rp/${id}/campaigns/voice`,
              icon: <Voicemail size={18} strokeWidth={1.5} />,
            },
          ],
        },
        {
          title: 'Vendors',
          path: `/projects/rp/${id}/vendors`,
          subtitle: 20,
          icon: <HandCoins size={18} strokeWidth={1.5} />,
        },
      ],
    },
    // {
    //   title: 'Actions',
    //   children: [
    //     {
    //       component: (
    //         <>
    //           <CreateTokenModal />
    //         </>
    //       ),
    //       title: 'Create Token',
    //     },

    //     {
    //       title: 'Close Project',
    //       path: '/edit',
    //       icon: <XCircle size={18} strokeWidth={1.5} />,
    //     },
    //     {
    //       title: 'Edit Project',
    //       path: `/projects/rp/${id}/edit`,
    //       icon: <Pencil size={18} strokeWidth={1.5} />,
    //     },
    //     {
    //       title: 'Add Beneficiary',
    //       path: `/projects/rp/${id}/beneficiary/add`,
    //       icon: <PlusSquare size={18} strokeWidth={1.5} />,
    //     },
    //     {
    //       title: 'Add Campaign',
    //       path: `/projects/rp/${id}/campaigns/add`,
    //       icon: <Plus size={18} strokeWidth={1.5} />,
    //     },
    //   ],
    // },
  ];

  return {
    navItems,
  };
};
