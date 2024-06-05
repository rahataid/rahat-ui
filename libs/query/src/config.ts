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
  GET_BENEFICIARIES_STATS: 'get_beneficiaries_stats',
  GET_VENDOr_STATS:'get_vendor_stats',
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
  GET_BENEFICIARIES_GROUPS: 'get_beneficiaries_groups'

};
export const PROJECT_SETTINGS_KEYS = {
  CONTRACT: 'CONTRACT',
  SUBGRAPH: 'SUBGRAPH_URL',
  TREASURY_SOURCES: 'TREASURY_SOURCES',
  DATASOURCE: 'DATASOURCE',
};

export const TREASURY_SOURCES = [
  {
    value: 'project_balance',
    label: 'Project Balance',
  },
  {
    value: 'user_wallet',
    label: 'User Wallet',
  },
  {
    value: 'multi_sig',
    label: 'MultiSig Wallet',
  },
];
