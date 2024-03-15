import { useParams } from 'next/navigation';
import {
  Pencil,
  PlusSquare,
  Speech,
  UsersRound,
  AlignVerticalJustifyCenter,
  Plus,
  Phone,
  MessageSquare,
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
          title: 'Beneficiaries',
          path: `/projects/aa/${params.id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Distributions',
          subtitle: 0,
          icon: <AlignVerticalJustifyCenter size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          icon: <Speech size={18} strokeWidth={1.5} />,
          children: [
            {
              title: 'Voice',
              subtitle: 10,
              icon: <Phone size={18} strokeWidth={1.5} />,
              path: `/projects/aa/${params.id}/communications/voice`,
            },
            {
              title: 'Text',
              subtitle: 10,
              icon: <MessageSquare size={18} strokeWidth={1.5} />,
              path: `/projects/aa/${params.id}/communications/text`,
            },
          ],
        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Add Beneficiary',
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Create Distribution',
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Create Communication',
          icon: <PlusSquare size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Edit Project',
          icon: <Pencil size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return navItems;
};
