const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  BENEFICIARY: '/beneficiary',
  USER: '/users',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  GROUPS: '/group',
  FIELD_DEFINITIONS: '/field-definitions',
  TARGETING: '/targeting',
  TREASURY: '/treasury',
  COMMS: '/communications/text',
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
      detail: (uuid: string) => `${ROOTS.BENEFICIARY}/${uuid}`,
    },
    treasury: {
      root: ROOTS.TREASURY,
      portfolio: `${ROOTS.TREASURY}/portfolio`,
      transactions: `${ROOTS.TREASURY}/transactions`,
      assets: `${ROOTS.TREASURY}/assets`,
      createToken: `${ROOTS.TREASURY}/createToken`,
    },
    user: ROOTS.USER,
    group: {
      root: ROOTS.GROUPS,
      add: `${ROOTS.GROUPS}/add`,
      import_logs: `${ROOTS.GROUPS}/import-logs`,
      detail: (uuid: string) => `${ROOTS.GROUPS}/${uuid}`,
    },
    fieldDefinitions: {
      add: `${ROOTS.FIELD_DEFINITIONS}/add`,
      import: `${ROOTS.FIELD_DEFINITIONS}/import`,
      root: ROOTS.FIELD_DEFINITIONS,
      detail: (uuid: string) => `${ROOTS.FIELD_DEFINITIONS}/${uuid}`,
    },
    targeting: {
      add: `${ROOTS.TARGETING}/add`,
      root: `${ROOTS.TARGETING}/filters`,
      list: `${ROOTS.TARGETING}/list`,
      detail: (uuid: string) => `${ROOTS.TARGETING}/${uuid}`,
    },
    comms: {
      root: ROOTS.COMMS,
    },
  },
  settings: {
    root: ROOTS.SETTINGS,
  },
};
