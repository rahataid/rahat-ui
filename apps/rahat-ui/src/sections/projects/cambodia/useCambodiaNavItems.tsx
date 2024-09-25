import { LayoutDashboard, Users } from 'lucide-react';
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
          path: `/projects/el-cambodia/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },

        {
          title: 'Health Worker',
          path: `/projects/el-cambodia/${id}/chw`,
          subtitle: 20,
          icon: <Users size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vision Center',
          path: `/projects/el-cambodia/${id}/vendors`,
          subtitle: 20,
          icon: <Users size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return {
    navItems,
  };
};
