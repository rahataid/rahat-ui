const ROOTS = {
  AUTH: '/auth',
  PROJECT: '/projects',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/user',
  TRANSACTIONS: '/transactions',
  VENDOR: '/vendors',
  COMMUNICATION: '/communications',
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
    vendor: ROOTS.VENDOR,
    communication: {
      voice: `${ROOTS.COMMUNICATION}/voice`,
      voiceDetail: (id: number) => `${ROOTS.COMMUNICATION}/voice/${id}`,
      text: `${ROOTS.COMMUNICATION}/text`,
    },
  },
};
