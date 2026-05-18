import { LayoutDashboard, MessageSquare, UserCheck, Users } from 'lucide-react';
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
          path: `/projects/el-crm/${id}`,
          subtitle: 20,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Customers',
          path: `/projects/el-crm/${id}/customers`,
          subtitle: 20,
          icon: <Users size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Consumers',
          path: `/projects/el-crm/${id}/consumers`,
          subtitle: 20,
          icon: <UserCheck size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Communications',
          path: `/projects/el-crm/${id}/communications/summary`,
          subtitle: 20,
          icon: <MessageSquare size={18} strokeWidth={1.5} />,
          children: [
            {
              title: 'Summary',
              path: `/projects/el-crm/${id}/communications/summary`,
              subtitle: 20,
            },
            {
              title: 'Templates',
              path: `/projects/el-crm/${id}/communications/templates`,
              subtitle: 20,
            },
            {
              title: 'Scheduled',
              path: `/projects/el-crm/${id}/communications/scheduled`,
              subtitle: 20,
            },
            {
              title: 'Messages',
              path: `/projects/el-crm/${id}/communications/messages`,
              subtitle: 20,
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
