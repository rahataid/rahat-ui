const ROOTS = {
  AUTH: '/auth',
  PROJECT: '/projects',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/user',
  TRANSACTIONS: '/transactions',
};

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    project: ROOTS.PROJECT,
    root: ROOTS.DASHBOARD,
    beneficiary: ROOTS.BENEFICIARY,
    transactions: ROOTS.TRANSACTIONS,
    user: ROOTS.USER,
  },
};
