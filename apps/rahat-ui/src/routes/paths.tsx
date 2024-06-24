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
};

export const paths = {
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
  },
};
