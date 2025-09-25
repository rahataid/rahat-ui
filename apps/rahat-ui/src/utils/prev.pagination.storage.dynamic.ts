import { hashStorage } from '@rahat-ui/query';

export const setPaginationToLocalStorage = (key: string) => {
  const storedPagination = hashStorage.getItem('pagination');
  if (storedPagination) {
    const pagination = JSON.stringify(storedPagination);
    localStorage.setItem(`prevPagination:${key}`, pagination);
  }
};

export const getPaginationFromLocalStorage = (
  key: string,
  isBackFromDetail: boolean,
) => {
  const storedData = localStorage.getItem(`prevPagination:${key}`);
  const prevPagination =
    storedData && isBackFromDetail
      ? JSON.parse(storedData)
      : { page: 1, perPage: 10 };

  return prevPagination;
};
