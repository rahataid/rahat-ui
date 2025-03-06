import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Speech,
  UsersRound,
  AlignVerticalJustifyCenter,
  Activity,
  HardDrive,
  LayoutDashboard,
  Users,
  Group,
  ParkingMeter,
  BadgeDollarSign,
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
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Project Beneficiaries',
          path: `/projects/aa/${params.id}/beneficiary`,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Stakeholders',
          path: `/projects/aa/${params.id}/stakeholders`,
          icon: <Users size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Groups',
          path: `/projects/aa/${params.id}/groups`,
          icon: <Group size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Data Sources',
          path: `/projects/aa/${params.id}/data-sources`,
          icon: <HardDrive size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Trigger Statements',
          path: `/projects/aa/${params.id}/trigger-statements`,
          icon: <ParkingMeter size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Activities',
          path: `/projects/aa/${params.id}/activities`,
          icon: <Activity size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Fund Management',
          path: `/projects/aa/${params.id}/fund-management`,
          icon: <AlignVerticalJustifyCenter size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communication Logs',
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/aa/${params.id}/communication-logs`,
        },
        // {
        //   title: 'Transaction Log',
        //   icon: <BadgeDollarSign size={18} strokeWidth={1.5} />,
        // },
      ],
    },
  ];
  return { navItems };
};
