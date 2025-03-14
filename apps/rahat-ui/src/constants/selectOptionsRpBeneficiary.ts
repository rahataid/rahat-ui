import { SelectOptionType } from "../types/selectOptions"

export const genderOptions: SelectOptionType[] = [
    {value: 'MALE', label: 'MALE'},
    {value: 'FEMALE', label: 'FEMALE'},
    {value: 'OTHER', label: 'OTHER'},
  ]

  export const internetOptions: SelectOptionType[] = [
    {value: 'NO_INTERNET', label: 'NO_INTERNET'},
    {value: 'HOME_INTERNET', label: 'HOME_INTERNET'},
    {value: 'UNKNOWN', label: 'UNKNOWN'},
  ]

  export const phoneOptions: SelectOptionType[] = [
    {value: 'SMART_PHONE', label: 'SMART_PHONE'},
    {value: 'FEATURE_PHONE', label: 'FEATURE_PHONE'}
  ]

  export const bankedOptions: SelectOptionType[] = [
    {value: 'UNDER_BANKED', label: 'UNDER_BANKED'},
    {value: 'BANKED', label: 'BANKED'},
    {value: 'UNKNOWN', label: 'UNKNOWN'},
  ]