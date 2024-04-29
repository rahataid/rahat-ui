import { useParams, usePathname } from 'next/navigation';
import {
  Pencil,
  PlusSquare,
  Speech,
  UsersRound,
  AlignVerticalJustifyCenter,
  Plus,
  Phone,
  MessageSquare,
  Activity,
  ClipboardCheck,
  BookCheck,
  ShieldCheck,
  HardDrive,
  LayoutDashboard,
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
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title:
        pathname === `/projects/aa/${params.id}/activities`
          ? 'Project : Activities'
          : 'Project Details',
      children: [
        ...(pathname === `/projects/aa/${params.id}/activities`
          ? [
            {
              title: 'Preparedness',
              // subtitle: 0,
              icon: <ClipboardCheck size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Readiness',
              // subtitle: 0,
              icon: <BookCheck size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Activation',
              // subtitle: 0,
              icon: <ShieldCheck size={18} strokeWidth={1.5} />,
            },
          ]
          : [
            {
              title: 'Dashboard',
              path: `/projects/aa/${params.id}`,
              icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Beneficiaries',
              path: `/projects/aa/${params.id}/beneficiary`,
              // subtitle: 20,
              icon: <UsersRound size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Distributions',
              // subtitle: 0,
              icon: (
                <AlignVerticalJustifyCenter size={18} strokeWidth={1.5} />
              ),
            },
            {
              title: 'Communications',
              icon: <Speech size={18} strokeWidth={1.5} />,
              children: [
                {
                  title: 'Voice',
                  // subtitle: 10,
                  icon: <Phone size={18} strokeWidth={1.5} />,
                  path: `/projects/aa/${params.id}/communications/voice`,
                },
                {
                  title: 'Text',
                  // subtitle: 10,
                  icon: <MessageSquare size={18} strokeWidth={1.5} />,
                  path: `/projects/aa/${params.id}/communications/text`,
                },
              ],
            },
            {
              title: 'Activities',
              path: `/projects/aa/${params.id}/activities`,
              // subtitle: 0,
              icon: <Activity size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Trigger Statements',
              path: `/projects/aa/${params.id}/trigger-statements`,
              // subtitle: 0,
              icon: <HardDrive size={18} strokeWidth={1.5} />,
            },
            {
              title: 'Data Sources',
              path: `/projects/aa/${params.id}/data-sources`,
              // subtitle: 0,
              icon: <HardDrive size={18} strokeWidth={1.5} />,
            },
          ]),
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          title: 'Add Trigger Statement',
          path: `/projects/aa/${params.id}/trigger-statements/add`,
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
          title: 'Add Activities',
          path: `/projects/aa/${params.id}/activities/add`,
          icon: <Plus size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Edit Project',
          icon: <Pencil size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return { navItems };
};
