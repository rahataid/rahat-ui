import { COLUMN_VISIBILITY_STORAGE_KEY } from '../constants/beneficiary.const';

export function getTableDisplayField() {
  const getData = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
  return getData
    ? JSON.parse(getData)
    : {
        walletAddress: false,
        email: false,
      };
}

export function setTableDisplayField(value: string) {
  localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, value);
}
