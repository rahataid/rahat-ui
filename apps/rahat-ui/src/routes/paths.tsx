const ROOTS = {
  AUTH: '/auth',
  PROJECT: '/projects',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/users',
  TRANSACTIONS: '/transactions',
  VENDOR: '/vendors',
  COMMUNICATION: '/communications',
  PROFILE: '/profile',
  TREASURY: '/treasury',
  COMMUNITYBENEFICIARY: '/community-beneficiary',
  SETTINGS: '/settings',
  APPAUTHENTICATION: '/auth-apps',
};

export const paths = {
  user: {
    root: ROOTS.USER,
  },
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  profile: {
    root: ROOTS.PROFILE,
  },
  dashboard: {
    project: {
      root: ROOTS.PROJECT,
      add: `${ROOTS.PROJECT}/add`,
      detail: (id: string) => `${ROOTS.PROJECT}/${id}`,
    },
    root: ROOTS.DASHBOARD,
    beneficiary: {
      root: ROOTS.BENEFICIARY,
      detail: (id: string) => `${ROOTS.BENEFICIARY}/${id}`,
    },
    transactions: ROOTS.TRANSACTIONS,
    treasury: ROOTS.TREASURY,
    vendor: ROOTS.VENDOR,
    communication: {
      voice: `${ROOTS.COMMUNICATION}/voice`,
      voiceDetail: (id: number) => `${ROOTS.COMMUNICATION}/voice/${id}`,
      text: `${ROOTS.COMMUNICATION}/text`,
      textDetail: (id: number) => `${ROOTS.COMMUNICATION}/text/${id}`,
      editTextCampaign: (id: number) =>
        `${ROOTS.COMMUNICATION}/text/${id}/edit`,
    },
    communitybeneficiary: ROOTS.COMMUNITYBENEFICIARY,
    appAuthentication: ROOTS.APPAUTHENTICATION,
  },
  settings: {
    root: ROOTS.SETTINGS,
  },
};

export const defaultNavigations = [
  {
    title: 'Dashboard',
    path: paths.dashboard.root,
    icon: 'LayoutDashboard',
  },
  {
    title: 'Project',
    path: paths.dashboard.project.root,
    icon: 'FolderDot',
  },
  {
    title: 'Beneficiaries',
    path: paths.dashboard.beneficiary.root,
    icon: 'UsersRound',
  },
  {
    title: 'Vendors',
    path: paths.dashboard.vendor,
    icon: 'Landmark',
  },
];

export const defaultSubNavigations = [
  {
    title: 'Users',
    path: paths.user.root,
    icon: 'Users',
  },
];
