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
      'This settings is used to export data from community tool to external apps. You can add multiple apps as follows:',
    key_value: [
      {
        key: 'APP1',
        value: '{YOUR_API_URL}/v1/beneficiaries/import-tools',
      },
      {
        key: 'APP2',
        value: '{YOUR_API_URL}/v1/beneficiaries/import-tools',
      },
    ],
  },
  {
    name: 'UNIQUE_FIELDS',
    requiredFields: 'DATA',
    description:
      'This settings is used to setup unique required fields for beneficiaries. You can select multiple keys, but they must be one of the following: email, phone, govtIDNumber, walletAddress',
    key_value: [
      {
        key: 'DATA',
        value: 'email,phone,govtIDNumber,walletAddress',
      },
    ],
  },
  {
    name: 'VERIFICATION_APP',
    description:
      'This settings is used to verify beneficiary wallet. Enter the URL of the verification app as follows:',
    requiredFields: 'URL',
    key_value: [
      {
        key: 'URL',
        value: '{YOUR_API_URL}/verify',
      },
    ],
  },
  {
    name: 'COMMUNICATIONS',
    requiredFields: 'URL, APP_ID',
    description:
      'This settings is used to send communication messages to beneficiaries',
    key_value: [
      {
        key: 'URL',
        value: '{COMM_SERVER_URL}/api/v1',
      },
      {
        key: 'APP_ID',
        value: '{COMM_APP_ID}',
      },
    ],
  },
  {
    name: 'VALIDATE_SECONDARY_FIELD',
    requiredFields: 'DATA',
    description:
      'This setting controls whether secondary fields should be validated during beneficiary import or update. Set the value to true to enable validation or false to disable it.',
    key_value: [
      {
        key: 'DATA',
        value: 'true',
      },
    ],
  },
  {
    name: 'AI_API_URL',
    requiredFields: 'URL, COMMUNITY_DATA_STANDARD',
    description:
      'This setting is used to configure the AI service endpoint for field mapping and define the community data standard used to generate field suggestions.. The COMMUNITY_DATA_STANDARD value should be specific to each project.',
    key_value: [
      {
        key: 'URL',
        value: '{AI_API_URL}',
      },
      {
        key: 'COMMUNITY_DATA_STANDARD',
        value: '{PROJECT_COMMUNITY_DATA_STANDARD}',
      },
    ],
  },
];
