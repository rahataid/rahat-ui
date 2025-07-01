import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  UsersRound,
  HardDrive,
  LayoutDashboard,
  SmartphoneNfc,
  HandCoinsIcon,
  CircleUserRound,
  SquareActivity,
  CloudAlert,
  Coins,
  Store,
  NotebookPenIcon,
} from 'lucide-react';

export type NavItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  subtitle?: string | number;
  onClick?: () => void;
  children?: NavItem[];
};

export const useNavItems = () => {
  const params = useParams();

  const navItems: NavItem[] = [
    {
      title: 'Project Details',

      children: [
        {
          title: 'Dashboard',
          path: `/projects/aa/${params.id}`,
          icon: <LayoutDashboard size={18} strokeWidth={2} />,
        },
        {
          title: 'Project Beneficiaries',
          path: `/projects/aa/${params.id}/beneficiary`,
          icon: <UsersRound size={18} strokeWidth={2} />,
        },
        {
          title: 'Stakeholders',
          path: `/projects/aa/${params.id}/stakeholders`,
          icon: <CircleUserRound size={18} strokeWidth={2} />,
        },
        // {
        //   title: 'Groups',
        //   path: `/projects/aa/${params.id}/groups`,
        //   icon: <Group size={18} strokeWidth={2} />,
        // },
        {
          title: 'Forecast Data',
          path: `/projects/aa/${params.id}/data-sources`,
          icon: <HardDrive size={18} strokeWidth={2} />,
        },
        {
          title: 'Activities',
          path: `/projects/aa/${params.id}/activities`,
          icon: <SquareActivity size={18} strokeWidth={2} />,
        },
        {
          title: 'Trigger Statements',
          path: `/projects/aa/${params.id}/trigger-statements`,
          icon: <CloudAlert size={18} strokeWidth={2} />,
        },
        {
          title: 'Fund Management',
          path: `/projects/aa/${params.id}/fund-management`,
          icon: <Coins size={18} strokeWidth={2} />,
        },
        {
          title: 'Payout',
          path: `/projects/aa/${params.id}/payout`,
          icon: <HandCoinsIcon size={18} strokeWidth={2} />,
        },
        {
          title: 'Vendors',
          path: `/projects/aa/${params.id}/vendors`,
          icon: <Store size={18} strokeWidth={2} />,
        },
        {
          title: 'Communication Logs',
          path: `/projects/aa/${params.id}/communication-logs`,
          icon: <SmartphoneNfc size={18} strokeWidth={2} />,
        },
        {
          title: 'Grievances',
          path: `/projects/aa/${params.id}/grievances`,
          icon: <NotebookPenIcon size={18} strokeWidth={2} />,
        },
      ],
    },
  ];
  return { navItems };
};
