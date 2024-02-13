const ROOTS = {
  AUTH: '/auth',
  REPORTING: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/user',
};

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    reporting: ROOTS.REPORTING,
    beneficiary: ROOTS.BENEFICIARY,
    user: ROOTS.USER,
  },
};
