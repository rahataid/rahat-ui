import {
  BankedStatus,
  PhoneStatus,
  Gender,
  InternetStatus,
} from '@rahataid/community-tool-sdk/enums/';

export const TARGETING_NAV_ROUTE = {
  DEFAULT: 'default',
};

export const genderOptions = [
  {
    label: 'Male',
    value: Gender.MALE,
  },
  {
    label: 'Female',
    value: Gender.FEMALE,
  },
  {
    label: 'Other',
    value: Gender.OTHER,
  },
  {
    label: 'Unknown',
    value: Gender.UKNOWN,
  },
];

export const internetStatusOptions = [
  {
    label: 'Home Internet',
    value: InternetStatus.HOME_INTERNET,
  },
  {
    label: 'Mobile Internet',
    value: InternetStatus.MOBILE_INTERNET,
  },
  {
    label: 'No Internet',
    value: InternetStatus.NO_INTERNET,
  },
  {
    label: 'Unknown',
    value: InternetStatus.UNKNOWN,
  },
];

export const phoneStatusOptions = [
  {
    label: 'Smart Phone',
    value: PhoneStatus.SMART_PHONE,
  },
  {
    label: 'Feature Phone',
    value: PhoneStatus.FEATURE_PHONE,
  },
  {
    label: 'No Phone',
    value: PhoneStatus.NO_PHONE,
  },
  {
    label: 'Unknown',
    value: PhoneStatus.UNKNOWN,
  },
];

export const bankedStatusOptions = [
  {
    label: 'Banked',
    value: BankedStatus.BANKED,
  },
  {
    label: 'Under Banked',
    value: BankedStatus.UNDER_BANKED,
  },
  {
    label: 'UnBanked',
    value: BankedStatus.UNBANKED,
  },
  {
    label: 'Unknown',
    value: BankedStatus.UNKNOWN,
  },
];
