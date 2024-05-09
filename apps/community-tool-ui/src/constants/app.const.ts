export const IMPORT_SOURCE = {
  KOBOTOOL: 'KOBOTOOL',
  EXCEL: 'EXCEL',
};

export const TARGET_FIELD = {
  HOUSE_HEAD_NAME: 'householdHeadName',
  FIRSTNAME: 'firstName',
  LASTNAME: 'lastName',
  GENDER: 'gender',
  BIRTH_DATE: 'birthDate',
  WALLET_ADDRESS: 'walletAddress',
  PHONE: 'phone',
  EMAIL: 'email',
  LOCATION: 'location',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude',
  IS_VULNERABLE: 'isVulnerable',
  GOVT_ID_NUMBER: 'govtIDNumber',
  NOTES: 'notes',
  PHONE_STATUS: 'phoneStatus',
  BANKED_STATUS: 'bankedStatus',
  INTERNET_STATUS: 'internetStatus',
  RAHAT_UUID: 'uuid',
};

export const BENEF_DB_FIELDS = [
  TARGET_FIELD.HOUSE_HEAD_NAME,
  TARGET_FIELD.FIRSTNAME,
  TARGET_FIELD.LASTNAME,
  TARGET_FIELD.GENDER,
  TARGET_FIELD.BIRTH_DATE,
  TARGET_FIELD.WALLET_ADDRESS,
  TARGET_FIELD.PHONE,
  TARGET_FIELD.EMAIL,
  TARGET_FIELD.LOCATION,
  TARGET_FIELD.LATITUDE,
  TARGET_FIELD.LONGITUDE,
  TARGET_FIELD.IS_VULNERABLE,
  TARGET_FIELD.GOVT_ID_NUMBER,
  TARGET_FIELD.NOTES,
  TARGET_FIELD.PHONE_STATUS,
  TARGET_FIELD.BANKED_STATUS,
  TARGET_FIELD.INTERNET_STATUS,
  TARGET_FIELD.RAHAT_UUID,
];

export const UNIQUE_FIELD = {
  PHONE: 'phone',
  EMAIL: 'email',
  GOVT_ID_NUMBER: 'govtIDNumber',
};

export const IMPORT_OPTIONS = [
  {
    label: IMPORT_SOURCE.EXCEL,
    value: IMPORT_SOURCE.EXCEL,
  },
  {
    label: IMPORT_SOURCE.KOBOTOOL,
    value: IMPORT_SOURCE.KOBOTOOL,
  },
];

export const UNIQUE_FIELD_OPTIONS = [
  {
    label: 'Phone',
    value: UNIQUE_FIELD.PHONE,
  },
  {
    label: 'Email',
    value: UNIQUE_FIELD.EMAIL,
  },
  {
    label: 'Govt ID Number',
    value: UNIQUE_FIELD.GOVT_ID_NUMBER,
  },
];

export const BENEF_IMPORT_SCREENS = {
  SELECTION: 'selection.page',
  VALIDATION: 'validation.page',
  IMPORT_DATA: 'import.page',
};

export const IMPORT_ACTION = {
  VALIDATE: 'VALIDATE',
  IMPORT: 'IMPORT',
};

export const SUBJECTS = [
  { label: 'All', value: 'all' },
  { label: 'Role', value: 'role' },
  { label: 'User', value: 'user' },
  { label: 'Public', value: 'public' },
  { label: 'Beneficiary', value: 'beneficiary' },
  { label: 'Target', value: 'target' },
  { label: 'Field Definition', value: 'fieldDefinition' },
  { label: 'Settings', value: 'settings' },
  { label: 'Source', value: 'source' },
  { label: 'Group', value: 'group' },
];

export const PERMISSIONS = [
  {
    id: 'manage',
    label: 'Manage',
  },
  {
    id: 'create',
    label: 'Create',
  },
  {
    id: 'read',
    label: 'Read',
  },
  {
    id: 'update',
    label: 'Update',
  },
  {
    id: 'delete',
    label: 'Delete',
  },
] as const;

export const MAX_EXPORT_COUNT = 1000;
