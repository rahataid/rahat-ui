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

const ACTION_ITEMS = ['manage', 'create', 'read', 'update', 'delete'];

export const SUBJECT_ACTIONS = {
  all: ACTION_ITEMS,
  beneficiary: ACTION_ITEMS,
  group: ACTION_ITEMS,
  fieldDefinition: ACTION_ITEMS,
  role: ACTION_ITEMS,
  settings: ACTION_ITEMS,
  source: ACTION_ITEMS,
  target: ACTION_ITEMS,
  user: ACTION_ITEMS,
};

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

export const MAX_IMPORT_COUNT = 2000;

export const FIELD_DEF_FETCH_LIMIT = 300;

export const MARKER_TYPE = {
  BANK: 'Bank',
  EVACUATION: 'Evacuation',
  BENEFICIARY: 'Beneficiary',
};
