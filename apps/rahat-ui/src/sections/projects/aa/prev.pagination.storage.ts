// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
