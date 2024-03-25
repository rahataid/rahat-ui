const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/users',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  GROUPS: '/group',
};

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  profile: {
    root: ROOTS.PROFILE,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    beneficiary: {
      add: `${ROOTS.BENEFICIARY}/add`,
      import: `${ROOTS.BENEFICIARY}/import`,
      root: ROOTS.BENEFICIARY,
      detail: (uuid: string) => `${ROOTS.BENEFICIARY}/${id}`,
    },
    user: ROOTS.USER,
    group: {
      root: ROOTS.GROUPS,
      add: `${ROOTS.GROUPS}/add`,
    },
  },
  settings: {
    root: ROOTS.SETTINGS,
  },
};
