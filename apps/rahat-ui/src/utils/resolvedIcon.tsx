import { AARoles } from '@rahat-ui/auth';
import * as LucideIcons from 'lucide-react';

export type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideIcons.LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

export type NavItemDB = {
  title: string;
  path: string; // relative path
  icon: string; // icon name as string
  roles?: AARoles[] | string[]; // optional array of roles
};

// DB nav config type
export type NavConfigDB = {
  navsettings: NavItemDB[];
};

export const resolveIcon = (iconName: string) => {
  const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as
    | LucideIcon
    | undefined;

  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in lucide-react`);
    return null;
  }

  return <Icon size={18} strokeWidth={2} />;
};
export const defaultNavConfig: NavConfigDB = {
  navsettings: [
    {
      title: 'Dashboard',
      path: '',
      icon: 'LayoutDashboard',
      roles: [
        'ADMIN',
        'MANAGER',
        'UNICEF_DONOR',
        'UNICEF_FIELD_OFFICE',
        'UNICEF_HEAD_OFFICE',
      ],
    },
    {
      title: 'Project Beneficiaries',
      path: 'beneficiary',
      icon: 'UsersRound',
    },
    {
      title: 'Stakeholders',
      path: 'stakeholders',
      icon: 'CircleUserRound',
    },
    {
      title: 'Forecast Data',
      path: 'data-sources',
      icon: 'HardDrive',
    },
    {
      title: 'Activities',
      path: 'activities',
      icon: 'SquareActivity',
    },
    {
      title: 'Trigger Statements',
      path: 'trigger-statements',
      icon: 'CloudAlert',
    },
    {
      title: 'Fund Management',
      path: 'fund-management',
      icon: 'Coins',
      roles: ['ADMIN', 'MANAGER', 'UNICEFNepalCO', 'Municipality'],
    },
    {
      title: 'Payout',
      path: 'payout',
      icon: 'HandCoinsIcon',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      title: 'Communication Logs',
      path: 'communication-logs',
      icon: 'SmartphoneNfc',
      roles: ['ADMIN', 'MANAGER'],
    },
  ],
};
