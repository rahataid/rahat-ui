const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/users',
  PROFILE: '/profile',
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
      detail: (id: string) => `${ROOTS.BENEFICIARY}/${id}`,
    },
    user: ROOTS.USER,
  },
};
