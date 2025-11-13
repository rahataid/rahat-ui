import { Text, Voicemail } from 'lucide-react';
import { NavItem } from './nav-items.types';

export const useCommsNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Communications',
      children: [
        {
          title: 'Text',
          icon: <Text size={18} strokeWidth={1.5} />,
          path: '/communications/text',
        },
        {
          title: 'Voice',
          icon: <Voicemail size={18} strokeWidth={1.5} />,
          path: '/communications/voice',
        },
        {
          title: 'IVR',
          icon: <Voicemail size={18} strokeWidth={1.5} />,
          path: '/communications/ivr',
        },
      ],
    },
  ];
  return menuItems;
};
