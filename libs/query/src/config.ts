export const TAGS = {
  GET_BENEFICIARY: 'get_one_beneficiary',
  GET_ALL_USER: 'get_all_user',
  GET_USER: 'get_user',
  GET_ALL_PROJECTS: 'get_all_projects',
  GET_ALL_ROLES: 'get_all_roles',
  GET_ROLE: 'get_role',
  GET_ALL_CAMPAIGNS: 'get_all_campaign',
  GET_CAMPAIGNS: 'get_campaign',
  GET_CAMPAIGNS_AUDIO: 'get_campaign_audio',
  GET_ALL_TRANSPORT: 'get_all_transport',
  GET_ALL_AUDIENCE: 'get_all_audience',
  GET_BENEFICIARIES: 'get_beneficiaries',
  VALIDATE_BENEFICIARIES: 'validate_beneficiaries',
  GET_STAKEHOLDERS: 'get_stakeholders',
  GET_BENEFICIARIES_STATS: 'get_beneficiaries_stats',
  GET_VENDOr_STATS: 'get_vendor_stats',
  GET_PROJECT_BENEFICIARIES_STATS: 'get_project_beneficiaries_stats',
  LIST_COMMUNITY_BENFICIARIES: 'list_community_beneficiaries',
  CREATE_COMMUNITY_BENEFICARY: 'create_community_beneficary',
  UPDATE_COMMUNITY_BENEFICARY: 'update_community_beneficary',
  REMOVE_COMMUNITY_BENEFICARY: 'remove_community_beneficary',
  CREATE_BULK_COMMUNITY_BENEFICARY: 'create_bulk_community_beneficary',
  CREATE_COMMUNITY_SETTINGS: 'create_community_settings',
  LIST_COMMUNITY_SETTINGS: 'list_community_settings',
  LIST_COMMUNITY_GROUP: 'list_community_group',
  ADD_COMMUNITY_GROUP: 'add_community_group',
  LIST_COMMUNITY_BENEFICIARY_GROUP: 'list_community_beneficiary_group',
  ADD_COMMUNITY_BENEFICIARY_GROUP: 'add_community_beneficiary_group',
  GET_VENDORS: 'list_vendors',
  GET_VENDOR_DETAILS: 'get_vendors_details',
  GET_PROJECT_DETAILS: 'get_project_details',
  GET_BENFICIARY_STATS: 'get_beneficiary_stats',
  GET_PROJECT_SETTINGS: 'get_project_settings',
  GET_BENEFICIARIES_GROUPS: 'get_beneficiaries_groups',
  GET_TEMP_GROUPS: 'get_temp_groups',
  GET_TEMP_BENEFICIARIES: 'get_temp_beneficiaries',
  IMPORT_TEMP_BENEFICIARIES: 'import_temp_beneficiaries',
  NEW_COMMS: {
    LIST_TRANSPORTS: 'new_comms.list_transports',
    RETRY_FAILED: 'new_comms.retry_failed',
  },
  ALL_NOTIFICATIONS: 'all_notifications',
};
export const PROJECT_SETTINGS_KEYS = {
  CONTRACT: 'CONTRACT',
  SUBGRAPH: 'SUBGRAPH_URL',
  TREASURY_SOURCES: 'TREASURY_SOURCES',
  DATASOURCE: 'DATASOURCE',
  HAZARD_TYPE: 'HAZARD_TYPE',
  SAFE_WALLET: 'SAFE_WALLET',
  PROJECT_INFO: 'PROJECTINFO',
  OFFRAMP: 'OFFRAMP',
  STELLAR_SETTINGS: 'STELLAR_SETTINGS',
};

export const TREASURY_SOURCES = [
  {
    value: 'PROJECT',
    label: 'Project Balance',
  },
  {
    value: 'EOA',
    label: 'User Wallet',
  },
  {
    value: 'MULTISIG',
    label: 'MultiSig Wallet',
  },
];

export const APP_JOBS = {
  EMAIL: 'email',
  SLACK: 'slack',
  OTP: 'otp',
};

export const MS_TIMEOUT = 500000;

export const BQUEUE = {
  RAHAT: 'RAHAT',
  RAHAT_PROJECT: 'RAHAT.PROJECT',
  RAHAT_BENEFICIARY: 'RAHAT.BENEFICIARY',
  HOST: 'RAHAT.HOST',
};

export const UserRoles = {
  ADMIN: 'Admin',
  USER: 'User',
  VENDOR: 'Vendor',
};

export const ACTIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
};

export const SUBJECTS = {
  ALL: 'all',
  BENEFICIARY: 'beneficiary',
  PROJECT: 'project',
  VENDOR: 'vendor',
  PUBLIC: 'public',
};

export const APP = {
  JWT_BEARER: 'JWT',
};

export const MS_CAM_ACTIONS = {
  CAMBODIA: {
    BENEFICIARY: {
      CREATE: 'cambodia.beneficiary.create',
      LIST: 'cambodia.beneficiary.list',
      DISCARDED_LIST: 'cambodia.beneficiary.list_discarded',
      GET: 'cambodia.beneficiary.get',
      DELETE: 'cambodia.beneficiary.delete',
      ADD_TO_PROJECT: 'cambodia.beneficiary.add_to_project',
    },
    CHW: {
      CREATE: 'cambodia.chw.create',
      LIST: 'cambodia.chw.list',
      GET: 'cambodia.chw.get',
      UPDATE: 'cambodia.chw.update',
      DELETE: 'cambodia.chw.delete',
      STATS: 'cambodia.chw.stats',
      BENEFICIARIES_STATS: 'cambodia.beneficiary.stats',
      VALIDATE_HEALTH_WORKER: 'cambodia.chw.validate_health_worker',
    },
    VENDOR: {
      LIST: 'cambodia.vendor.list',
      GET: 'cambodia.vendor.get',
      UPDATE_IS_VERIFIED: 'cambodia.vendor.update_is_verified',
      ASSIGN_TO_PROJECT: 'cambodia.vendor.assign_to_project',
      LIST_BY_PROJECT: 'vendor.list_by_project',
      GET_BY_UUID: 'vendor.get_by_uuid',
      STATS: 'cambodia.vendor.stats',
      HEALTH_WORKERS: 'cambodia.vendor.health_workers',
      LEAD_CONVERSIONS: 'cambodia.vendor.lead_conversions',
    },
    COMMISION_SCHEME: {
      CREATE: 'cambodia.commission_scheme.create',
      LIST: 'cambodia.commission_scheme.list',
      GET_CURRENT: 'cambodia.commission_scheme.get_current',
      STATS: 'cambodia.app.stats',
    },
    COMMUNICATION: {
      LIST: 'cambodia.communication.list',
      BROAD_CAST_STATUS_COUNT: 'cambodia.app.broadcast_status_count',
      TRIGGER_COMMUNICATION: 'cambodia.app.trigger_communication',
    },
    LINE_STATS: 'cambodia.app.line_stats',
    PROJECT_SETTINGS: 'cambodia.app.project_settings',
  },
};

export const TOKEN_TO_AMOUNT_MULTIPLIER = 1;
