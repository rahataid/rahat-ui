import { FileDigit } from 'lucide-react';
import { NavItem } from './audit-items.types';

export const useAuditNavItems = () => {
  const menuItems: NavItem[] = [
    {
      title: 'Audit',
      children: [
        {
          title: 'Audit',
          icon: <FileDigit size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];
  return menuItems;
};
