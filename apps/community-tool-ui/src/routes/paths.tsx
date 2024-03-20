const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/users',
  PROFILE: '/profile',
  SETTINGS: '/settings',
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
      root: ROOTS.BENEFICIARY,
      detail: (uuid: string) => `${ROOTS.BENEFICIARY}/${id}`,
    },
    user: ROOTS.USER,
  },
  settings: {
    root: ROOTS.SETTINGS,
  },
};
