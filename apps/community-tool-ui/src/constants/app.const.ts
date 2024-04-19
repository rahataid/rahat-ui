export const IMPORT_SOURCE = {
  KOBOTOOL: 'KOBOTOOL',
  EXCEL: 'EXCEL',
};

export const TARGET_FIELD = {
  FULL_NAME: 'fullName',
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
  GOVT_ID_TYPE: 'govtIDType',
  GOVT_ID_NUMBER: 'govtIDNumber',
  GOVT_ID_PHOTO: 'govtIDPhoto',
  NOTES: 'notes',
  PHONE_STATUS: 'phoneStatus',
  BANKED_STATUS: 'bankedStatus',
  INTERNET_STATUS: 'internetStatus',
  RAHAT_UUID: 'rahat_uuid',
};

export const BENEF_DB_FIELDS = [
  TARGET_FIELD.FULL_NAME,
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
  TARGET_FIELD.GOVT_ID_TYPE,
  TARGET_FIELD.GOVT_ID_NUMBER,
  TARGET_FIELD.GOVT_ID_PHOTO,
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
];

export const MAX_EXPORT_COUNT = 500;
