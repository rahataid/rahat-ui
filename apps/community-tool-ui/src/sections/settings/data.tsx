interface KeyValue {
  key: string;
  value: string;
}

interface Setting {
  name: string;
  requiredFields: string;
  description: string;
  key_value: KeyValue[];
}

export const SETTINGS_SAMPLE: Setting[] = [
  {
    name: 'EXTERNAL_APPS',
    requiredFields: 'APP1, APP2',
    description:
      'This settings is used to export data from community tools to external apps',
    key_value: [
      {
        key: 'APP1',
        value: '{YOUR_APP_URL}/v1/beneficiaries/import-tools',
      },
      {
        key: 'APP2',
        value: '{YOUR_APP_URL}/v1/beneficiaries/import-tools',
      },
    ],
  },
  {
    name: 'VERIFICATION_APP',
    description: 'This settings is used to verify the beneficiaries',

    requiredFields: 'URL',
    key_value: [{ key: 'URL', value: '{YOUR_APP_URL}/verify' }],
  },
];
