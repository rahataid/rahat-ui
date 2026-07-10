'use client';
import { Pagination } from '@rumsan/sdk/types';
import { useState, useEffect, useMemo, useCallback } from 'react';

export const hashStorage = {
  getItem: (key: string): any => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const storedValue = searchParams.get(key);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  setItem: (key: string, newValue: any): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    window.location.hash = searchParams.toString();
  },
  removeItem: (key: string): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.delete(key);
    window.location.hash = searchParams.toString();
  },
};

type usePaginationReturn = {
  pagination: Pagination;
  filters: {
    [key: string]: string;
  };
  selectedListItems: any;
  setPagination: (pagination: Pagination) => void;
  setFilters: (filters: { [key: string]: any }) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
  setFirstPage: () => void;
  setLastPage: (page: number) => void;
  resetPagination: () => void;
  resetFilters: () => void;
  setSelectedListItems: (selectedListItems: any) => void;
  resetSelectedListItems: () => void;
  setPerPage: (perPage: number | string) => void;
};

// ...existing code...

export const usePagination = (namespace?: string): usePaginationReturn => {
  const prefix = namespace ? `${namespace}:` : '';
  const paginationKey = `${prefix}pagination`;
  const filtersKey = `${prefix}filters`;
  const selectedListItemsKey = `${prefix}selectedListItems`;

  const [pagination, setPagination] = useState<Pagination>(
    //TO DO: Need to update the perPage value
    hashStorage.getItem(paginationKey) || { page: 1, perPage: 10 },
  );
  const [filters, setFilters] = useState<{ [key: string]: string }>(
    hashStorage.getItem(filtersKey) || {},
  );
  const [selectedListItems, setSelectedListItems] = useState<any>({});

  useEffect(() => {
    const storedPagination = hashStorage.getItem(paginationKey);
    if (JSON.stringify(storedPagination) !== JSON.stringify(pagination)) {
      hashStorage.setItem(paginationKey, pagination);
    }
  }, [pagination]);

  useEffect(() => {
    const storedFilters = hashStorage.getItem(filtersKey);
    if (JSON.stringify(storedFilters) !== JSON.stringify(filters)) {
      hashStorage.setItem(filtersKey, filters);
    }
    // Use functional update to avoid stale closure on `pagination` and skip
    // the re-render entirely when the page is already 1.
    setPagination((prev) => (prev.page !== 1 ? { ...prev, page: 1 } : prev));
  }, [filters]);

  useEffect(() => {
    const storedSelectedListItems = hashStorage.getItem(selectedListItemsKey);
    if (
      JSON.stringify(storedSelectedListItems) !==
      JSON.stringify(selectedListItems)
    ) {
      hashStorage.setItem(selectedListItemsKey, selectedListItems);
    }
  }, [selectedListItems]);

  const setNextPage = useCallback(
    () => setPagination((prev) => ({ ...prev, page: prev.page + 1 })),
    [],
  );
  const setPrevPage = useCallback(
    () => setPagination((prev) => ({ ...prev, page: prev.page - 1 })),
    [],
  );

  const setFirstPage = useCallback(
    () => setPagination((prev) => ({ ...prev, page: 1 })),
    [],
  );
  const setLastPage = useCallback(
    (page: number) => setPagination((prev) => ({ ...prev, page: page })),
    [],
  );
  const resetPagination = useCallback(
    () => setPagination({ page: 1, perPage: 10 }),
    [],
  );
  const resetFilters = useCallback(() => setFilters({}), []);
  const resetSelectedListItems = useCallback(
    () => setSelectedListItems([]),
    [],
  );
  const setPerPage = useCallback(
    (perPage: number | string) =>
      setPagination((prev) => ({
        ...prev,
        perPage: Number(perPage),
        page: 1,
      })),
    [],
  );

  return {
    pagination,
    filters,
    setPagination,
    setFilters,
    setNextPage,
    setPrevPage,
    setFirstPage,
    setLastPage,
    resetPagination,
    resetFilters,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
    setPerPage,
  };
};
