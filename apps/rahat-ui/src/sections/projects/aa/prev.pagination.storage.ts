import { hashStorage } from '@rahat-ui/query';

export const setPaginationToLocalStorage = () => {
  const storedPagination = hashStorage.getItem('pagination');
  if (storedPagination) {
    const pagination = JSON.stringify(storedPagination);
    localStorage.setItem('prevPagination', pagination);
  }
};

export const getPaginationFromLocalStorage = (isBackFromDetail: boolean) => {
  const storedData = localStorage.getItem('prevPagination');
  const prevPagination =
    storedData && isBackFromDetail
      ? JSON.parse(storedData)
      : { page: 1, perPage: 10 };

  return prevPagination;
};
