export const IMPORT_SOURCE = {
  KOBOTOOL: 'KOBOTOOL',
  EXCEL: 'EXCEL',
};

export const TARGET_FIELD = {
  FULL_NAME: 'fullName',
  FIRSTNAME: 'firstName',
  LASTNAME: 'lastName',
  LOCATION: 'location',
  WALLET_ADDRESS: 'walletAddress',
  PHONE: 'phone',
  EMAIL: 'email',
  GENDER: 'gender',
  BIRTH_DATE: 'birthDate',
  NOTES: 'notes',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude',
  PHONE_STATUS: 'phoneStatus',
  BANKED_STATUS: 'bankedStatus',
  INTERNET_STATUS: 'internetStatus',
};

export const BENEF_DB_FIELDS = [
  TARGET_FIELD.FULL_NAME,
  TARGET_FIELD.FIRSTNAME,
  TARGET_FIELD.LASTNAME,
  TARGET_FIELD.LOCATION,
  TARGET_FIELD.PHONE,
  TARGET_FIELD.EMAIL,
  TARGET_FIELD.WALLET_ADDRESS,
  TARGET_FIELD.GENDER,
  TARGET_FIELD.BIRTH_DATE,
  TARGET_FIELD.NOTES,
  TARGET_FIELD.LATITUDE,
  TARGET_FIELD.LONGITUDE,
  TARGET_FIELD.PHONE_STATUS,
  TARGET_FIELD.BANKED_STATUS,
  TARGET_FIELD.INTERNET_STATUS,
];

export const UNIQUE_FIELD = {
  PHONE: 'phone',
  EMAIL: 'email',
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
];

export const BENEF_IMPORT_SCREENS = {
  SELECTION: 'selection.page',
  VALIDATION: 'validation.page',
};
