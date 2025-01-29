import React from 'react';
import {
  LayoutDashboard,
  MessageSquareText,
  Speech,
  UsersRound,
  Voicemail,
} from 'lucide-react';

// import { NavItem } from '../components';
import { useParams } from 'next/navigation';
import { NavItem } from 'modules/layout/nav-items.types';

export const useNavItems = () => {
  const { id } = useParams();

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/comms/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/comms/${id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/comms/${id}/campaigns/text`,
          children: [
            {
              title: 'Text',
              path: `/projects/comms/${id}/campaigns/text`,
              icon: <MessageSquareText size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Voice',
              path: `/projects/comms/${id}/campaigns/voice`,
              icon: <Voicemail size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Ivr',
              path: `/projects/comms/${id}/campaigns/ivr`,
              icon: <Voicemail size={18} strokeWidth={1.5} />,
            },
          ],
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
