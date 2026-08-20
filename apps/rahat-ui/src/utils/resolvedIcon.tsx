import { AARoles } from '@rahat-ui/auth';
import * as LucideIcons from 'lucide-react';
import { SUBJECTS } from '../constants/ability.constants';

export type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideIcons.LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

export type NavItemDB = {
  title: string;
  path: string; // relative path
  icon: string; // icon name as string
  roles?: AARoles[] | string[]; // optional array of roles
  subject?: string; // CASL subject used for ability-based visibility
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
      subject: SUBJECTS.ALL,
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
      subject: SUBJECTS.FUND_MANAGEMENT,
    },
    {
      title: 'Payout',
      path: 'payout',
      icon: 'HandCoinsIcon',
      roles: ['ADMIN', 'MANAGER', 'UNICEFNepalCO', 'Municipality'],
      subject: SUBJECTS.PAYOUT,
    },
    {
      title: 'Communication Logs',
      path: 'communication-logs',
      icon: 'SmartphoneNfc',
      roles: ['ADMIN', 'MANAGER', 'UNICEFNepalCO', 'Municipality'],
      subject: SUBJECTS.COMMUNICATION_LOG,
    },
    {
      title: 'Grievances',
      path: 'grievances',
      icon: 'Coins',
      roles: ['ADMIN', 'MANAGER', 'UNICEFNepalCO', 'Municipality'],
      subject: SUBJECTS.GRIEVANCE,
    },
  ],
};
